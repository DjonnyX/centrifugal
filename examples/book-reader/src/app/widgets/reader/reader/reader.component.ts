import { Component, computed, DestroyRef, effect, ElementRef, inject, input, OnDestroy, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError, combineLatest, debounceTime, distinctUntilChanged, filter, map, of, Subject, switchMap, tap, throwError,
} from 'rxjs';
import { PageLoadingIndicatorComponent } from '@entities/book';
import { PageBoxComponent } from '@features/page';
import { NtListComponent } from '@shared/components';
import { IBookPageData } from "@shared/models/pages";
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { ILocalization, LocalizationService } from '@shared/localization';
import { StaticClickDirective } from '@shared/directives';
import { validateCollection } from './utils/validate-collection';
import { ReaderService } from '../reader.service';
import { IProxyCollectionItem, ProxyCollection, ProxyCollectionEvents } from './utils/proxy-collection';
import { CustomScrollBarTheme } from '@shared/components/custom-scrollbar/interfaces/custom-scrollbar-theme';
import { CustomScrollbarModule } from '@shared/components/custom-scrollbar/custom-scrollbar.module';
import { MediaService } from '@shared/directives/media';
import {
  NtListModule, FocusAlignments, INtListAnimationParams, Id, IDisplayObjectConfig, IScrollEvent, IVirtualListItem,
  NtListPublicService, IScrollingSettings,
} from 'centrifugal';

const SCROLLBAR_PRESET = 'x-scrollbar-secondary',
  CHUNK_SIZE = 400;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-reader',
  imports: [
    CommonModule, PageBoxComponent, NtListModule, PageLoadingIndicatorComponent, StaticClickDirective, CustomScrollbarModule,
  ],
  standalone: true,
  templateUrl: './reader.component.html',
  styleUrl: './reader.component.scss',
})
export class ReaderComponent implements OnDestroy {
  protected _wrapper = viewChild<ElementRef<HTMLDivElement>>('wrapper');

  protected _list = viewChild<NtListComponent>('list');

  scrollingSettings: IScrollingSettings = {
    frictionalForce: 0.035,
    mass: 0.005,
    maxDistance: 10000,
    maxDuration: 4000,
    speedScale: 4,
    optimization: false,
  }

  search = input<string>();

  scrollStartOffset = input<number>(0);

  scrollEndOffset = input<number>(0);

  isLazyLoading = signal<boolean>(false);

  searchedPattern = signal<Array<string>>([]);

  collection = signal<Array<IProxyCollectionItem<IBookPageData>>>([]);
  protected $collection = toObservable(this.collection);

  theme: Signal<ITheme | undefined>;

  protected _proxyCollection = new ProxyCollection<IBookPageData>([]);

  animationParams: INtListAnimationParams = { scrollToItem: 25, navigateToItem: 200, navigateByKeyboard: 50, snapToItem: 150 };

  selectedIds = signal<Array<Id> | Id | null>([]);

  isLoading = signal<boolean>(true);

  isListShowed: Signal<boolean | undefined>;

  defaultItemValue = signal<IVirtualListItem<IBookPageData>>({
    text: '',
    id: '-1',
  });

  scrollbarTheme: Signal<CustomScrollBarTheme>;

  private _$change = new Subject<{
    item: IVirtualListItem<IProxyCollectionItem<IBookPageData>>,
    config: IDisplayObjectConfig,
    api: NtListPublicService,
    value: string | undefined
  }>();
  protected $change = this._$change.asObservable();

  private _$scroll = new Subject<IScrollEvent>();
  protected $scroll = this._$scroll.asObservable();

  private _$scrollReachEnd = new Subject<void>();
  protected $scrollReachEnd = this._$scrollReachEnd.asObservable();

  private _readerService = inject(ReaderService);

  private _destroyRef = inject(DestroyRef);

  listClass: Signal<{ [className: string]: boolean }>;

  showScrollToStart = signal<boolean>(false);

  private _chunkNumber = 1;

  private _$proxyCollectionChange = new Subject<void>();
  protected $proxyCollectionChange = this._$proxyCollectionChange.asObservable();

  private _proxyCollectionChangeHandler = () => {
    this._$proxyCollectionChange.next();
  };

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _mediaService = inject(MediaService);

  private _themeService = inject(ThemeService);

  private _localizationService = inject(LocalizationService);

  readonly maxStaticClickDistance = 40;

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

    combineLatest([this._mediaService.$bounds, this._readerService.$bookId.pipe(
      takeUntilDestroyed(),
      distinctUntilChanged(),
    )]).pipe(
      takeUntilDestroyed(),
      tap(([, bookId]) => {
        this._readerService.clear(bookId);
      }),
    ).subscribe();

    this.scrollbarTheme = computed(() => {
      const theme = this.theme();
      if (theme) {
        const preset = this._themeService.getPreset(SCROLLBAR_PRESET);
        if (preset) {
          return preset;
        }
      }
      return undefined;
    });

    let locale: string | undefined,
      localization: ILocalization | undefined;

    this._localizationService.$locale.pipe(
      takeUntilDestroyed(),
      tap(v => {
        locale = v;
      }),
    ).subscribe();

    this._localizationService.$localization.pipe(
      takeUntilDestroyed(),
      tap(v => {
        localization = v;
      }),
    ).subscribe();

    effect(() => {
      const theme = this.theme(), host = this._elementRef.nativeElement as HTMLDivElement;
      if (theme && host) {
        const preset = this._themeService.getPreset(theme.bookReader.messages);
        if (preset) {
          host.style.background = preset.background;
        }
      }
    });

    effect(() => {
      const theme = this.theme(), wrapper = this._wrapper()?.nativeElement;
      if (theme && wrapper) {
        const preset = this._themeService.getPreset(theme.bookReader.messages);
        if (preset) {
          wrapper.style.backgroundImage = preset.backgroundImage;
        }
      }
    });

    this.listClass = computed(() => {
      const loading = this.isLoading();
      return { loading };
    });

    this._proxyCollection.addEventListener(ProxyCollectionEvents.CHANGE, this._proxyCollectionChangeHandler);
    const $collection = toObservable(this.collection),
      $search = toObservable(this.search),
      $scroll = this.$scroll,
      $scrollReachEnd = this.$scrollReachEnd,
      $bookId = this._readerService.$bookId,
      $proxyCollectionChange = this.$proxyCollectionChange,
      $virtualList = toObservable(this._list).pipe(
        takeUntilDestroyed(),
        filter(list => !!list),
      );

    // protection against resetting a collection to a new one
    $proxyCollectionChange.pipe(
      takeUntilDestroyed(),
      switchMap(() => {
        const c = this._proxyCollection.toObject();
        if (c.length === 0) {
          return of(c);
        }
        return of(c).pipe(
          takeUntilDestroyed(this._destroyRef),
        );
      }),
      tap(c => {
        this.collection.set(c);
      }),
    ).subscribe();

    $virtualList.pipe(
      takeUntilDestroyed(),
      tap(list => {
        this._readerService.virtualList = list;
      }),
    ).subscribe();

    const $listPrepared = $virtualList.pipe(
      takeUntilDestroyed(),
      switchMap(list => {
        return list.$show;
      }),
    );

    this.isListShowed = toSignal($listPrepared);

    combineLatest([$virtualList, $bookId]).pipe(
      takeUntilDestroyed(),
      map(([list, bookId]) => ({ list, bookId })),
      filter(({ list, bookId }) => !!list && bookId !== null),
      tap(({ list }) => {
        // reset
        this._chunkNumber = 1;
        this.isLoading.set(true);
        if (this._proxyCollection.collection.length > 0) {
          this._proxyCollection.from([]);
          this.selectedIds.set([]);
        }
      }),
    ).subscribe();

    $bookId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(bookId => {
        return of(bookId).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.isLoading.set(true);
          }),
          switchMap(bookId => {
            return this._readerService.getPages(bookId!, {
              number: this._chunkNumber,
              size: CHUNK_SIZE,
            }).pipe(
              takeUntilDestroyed(this._destroyRef),
              switchMap(v => of(v)),
            );
          }),
          catchError((err) => {
            return throwError(() => {
              return `Get message chunk error: ${err}`;
            });
          }),
          takeUntilDestroyed(this._destroyRef),
          switchMap(res => {
            const items = Array.isArray(res.pages) ? res.pages : [];
            validateCollection(items);

            this._proxyCollection.from(items, true);

            return of(items);
          }),
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.isLoading.set(false);
          }),
          catchError((err) => {
            console.error(err);
            this.isLoading.set(false);
            return of(null);
          }),
        );
      }),
    ).subscribe();

    $bookId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(() => {
        return $scroll.pipe(
          takeUntilDestroyed(this._destroyRef),
          filter(() => !this.isLoading()),
          debounceTime(10),
          takeUntilDestroyed(this._destroyRef),
          filter(e => !!e),
          tap(e => {
            this.showScrollToStart.set(!e.isStart);
          }),
        );
      }),
    ).subscribe();

    $bookId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(bookId => {
        return $scrollReachEnd.pipe(
          takeUntilDestroyed(this._destroyRef),
          filter(() => !this.isLoading()),
          switchMap(() => {
            this.isLazyLoading.set(true);
            return this._readerService.getPages(bookId, {
              number: this._chunkNumber + 1,
              size: CHUNK_SIZE,
            }).pipe(
              takeUntilDestroyed(this._destroyRef),
              switchMap(v => of(v)),
            );
          }),
          catchError((err) => {
            return throwError(() => {
              return `Get message chunk error: ${err}`;
            });
          }),
          tap(res => {
            this.isLazyLoading.set(false);
            const items = Array.isArray(res.pages) ? res.pages : [];
            this._chunkNumber++;
            validateCollection(items);

            this._proxyCollection.from(items, true);
          }),
          catchError((err) => {
            this.isLazyLoading.set(false);
            console.error(err);
            return of(null);
          }),
        );
      }),
    ).subscribe();

    combineLatest([$virtualList, $collection, $search]).pipe(
      takeUntilDestroyed(),
      map(([list, collection, search]) => ({ list, collection, search: search ?? '' })),
      filter(({ list }) => !!list),
      debounceTime(250),
      takeUntilDestroyed(this._destroyRef),
      tap(({ search }) => {
        this.searchedPattern.set(search.split?.(' ') ?? []);
      }),
      filter(({ search }) => search !== ''),
      switchMap(({ list, collection, search }) => {
        for (let i = 0, l = collection.length; i < l; i++) {
          const item = collection[i], name: string = item.data?.text;
          if (name) {
            const index = name?.indexOf(search);
            if (index > -1) {
              const id = item.id;
              return of(({ id, list }));
            }
          }
        }
        return of({ id: null, list: undefined });
      }),
      takeUntilDestroyed(this._destroyRef),
      tap(({ id, list }) => {
        if (id !== null && list) {
          list!.scrollTo(id, null, { focused: false });
        }
      }),
      debounceTime(2000),
      takeUntilDestroyed(this._destroyRef),
      tap(({ id, list }) => {
        if (id !== null && list) {
          list.focus(id, FocusAlignments.NONE);
        }
      }),
    ).subscribe();
  }

  hide() {
    this.isLoading.set(true);
  }

  onScrollReachEndHandler() {
    this._$scrollReachEnd.next(undefined);
  }

  onScrollHandler(e: IScrollEvent) {
    this._$scroll.next(e);
  }

  onScrollToStartClickHandler() {
    const list = this._list();
    if (list) {
      list.scrollToStart();
    }
  }

  ngOnDestroy(): void {
    if (this._proxyCollection) {
      this._proxyCollection.dispose();
    }
  }
}
