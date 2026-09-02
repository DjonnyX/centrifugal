import { Component, computed, DestroyRef, effect, ElementRef, inject, input, OnDestroy, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError, combineLatest, debounceTime, filter, map, of, Subject, switchMap, tap, throwError,
} from 'rxjs';
import { ItemsLoadingIndicatorComponent } from '@entities/file-viewer';
import { GroupComponent } from '@entities/item';
import { ItemBoxComponent } from '@features/file-viewer';
import { NtListComponent } from '@shared/components';
import {
  NtListModule, FocusAlignments, INtListAnimationParams, Id, IDisplayObjectConfig, IScrollEvent, IVirtualListItem,
  IVirtualListItemConfigMap, NtListPublicService, IScrollingSettings,
} from 'centrifugal';
import { IFileViewerItemData } from "@shared/models/message";
import { MessageTypes } from '@shared/enums';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { ILocalization, LocaleSensitiveDirective, LocalizationService } from '@shared/localization';
import { resourceManager } from '@shared/utils/resource-manager';
import { StaticClickDirective } from '@shared/directives';
import { ItemsService } from '../items.service';
import { fillConfigMap } from './utils/fill-config-map';
import { validateCollection } from './utils/validate-collection';
import { ItemService } from '../item.service';
import { IProxyCollectionItem, ProxyCollection, ProxyCollectionEvents } from './utils/proxy-collection';
import { createGroups } from './utils/create-groups';
import { CustomScrollBarTheme } from '@shared/components/custom-scrollbar/interfaces/custom-scrollbar-theme';
import { CustomScrollbarModule } from '@shared/components/custom-scrollbar/custom-scrollbar.module';
import { ScrollToStartButtonComponent } from '@entities/item/scroll-to-start-button/scroll-to-start-button.component';
import { MediaService } from '@shared/directives/media';

const SCROLLBAR_PRESET = 'x-scrollbar-secondary',
  CHUNK_SIZE = 400;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-file-viewer-items',
  imports: [
    CommonModule, ItemBoxComponent, GroupComponent, NtListModule,
    ItemsLoadingIndicatorComponent, ScrollToStartButtonComponent,
    StaticClickDirective, LocaleSensitiveDirective, CustomScrollbarModule,
  ],
  standalone: true,
  templateUrl: './file-viewer-items.component.html',
  styleUrl: './file-viewer-items.component.scss',
})
export class FileViewerItemsComponent implements OnDestroy {
  protected _wrapper = viewChild<ElementRef<HTMLDivElement>>('wrapper');

  protected _list = viewChild('list', { read: NtListComponent });

  scrollingSettings: IScrollingSettings = {
    frictionalForce: 0.035,
    mass: 0.005,
    maxDistance: 100000,
    maxDuration: 4000,
    speedScale: 10,
    optimization: false,
  }

  search = input<string>();

  scrollStartOffset = input<number>(0);

  scrollEndOffset = input<number>(0);

  isLazyLoading = signal<boolean>(false);

  searchedPattern = signal<Array<string>>([]);

  collection = signal<Array<IProxyCollectionItem<IFileViewerItemData>>>([]);
  protected $collection = toObservable(this.collection);

  theme: Signal<ITheme | undefined>;

  protected _proxyCollection = new ProxyCollection<IFileViewerItemData>([]);

  animationParams: INtListAnimationParams = { scrollToItem: 25, navigateToItem: 200, navigateByKeyboard: 50, snapToItem: 150 };

  collectionConfigMap = signal<IVirtualListItemConfigMap>({});

  selectedIds = signal<Array<Id> | Id>([]);

  isLoading = signal<boolean>(true);

  isListShowed: Signal<boolean | undefined>;

  defaultItemValue = signal<IVirtualListItem<IFileViewerItemData>>({
    dateTime: 0,
    mailed: false,
    text: '',
    edited: false,
    incomType: 'in',
    type: MessageTypes.ITEM,
    id: '-1',
  });

  scrollbarTheme: Signal<CustomScrollBarTheme>;

  private _$change = new Subject<{
    item: IVirtualListItem<IProxyCollectionItem<IFileViewerItemData>>,
    config: IDisplayObjectConfig,
    api: NtListPublicService,
    value: string | undefined
  }>();
  protected $change = this._$change.asObservable();

  private _$scroll = new Subject<IScrollEvent>();
  protected $scroll = this._$scroll.asObservable();

  private _$scrollReachEnd = new Subject<void>();
  protected $scrollReachEnd = this._$scrollReachEnd.asObservable();

  private _messagesService = inject(ItemsService);

  private _messageService = inject(ItemService);

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

  readonly itemSize = 180;

  protected _divides = signal<number>(1);

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

    this.scrollbarTheme = computed(() => {
      const theme = this.theme();
      if (!!theme) {
        const preset = this._themeService.getPreset(SCROLLBAR_PRESET);
        if (!!preset) {
          return preset;
        }
      }
      return undefined;
    });

    this._mediaService.$bounds.pipe(
      takeUntilDestroyed(),
      tap(({ width }) => {
        this._divides.set(Math.floor(width / this.itemSize));
      }),
    ).subscribe();

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
        const preset = this._themeService.getPreset(theme.fileViewer.items);
        if (!!preset) {
          host.style.background = preset.background;
        }
      }
    });

    effect(() => {
      const theme = this.theme(), wrapper = this._wrapper()?.nativeElement;
      if (theme && wrapper) {
        const preset = this._themeService.getPreset(theme.fileViewer.items);
        if (!!preset) {
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
      $groupId = this._messageService.$groupId,
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
        this._messageService.virtualList = list;
      }),
    ).subscribe();

    const $listPrepared = $virtualList.pipe(
      takeUntilDestroyed(),
      switchMap(list => {
        return list.$show;
      }),
    );

    this.isListShowed = toSignal($listPrepared);

    combineLatest([$virtualList, $groupId]).pipe(
      takeUntilDestroyed(),
      map(([list, groupId]) => ({ list, groupId })),
      filter(({ list, groupId }) => !!list && groupId !== null),
      tap(({ list }) => {
        // reset
        resourceManager.clear();
        this._chunkNumber = 1;
        this.isLoading.set(true);
        if (this._proxyCollection.collection.length > 0) {
          this._proxyCollection.from([]);
          this.selectedIds.set([]);
        }
      }),
    ).subscribe();

    $groupId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(groupId => {
        return of(groupId).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.isLoading.set(true);
          }),
          switchMap(groupId => {
            return this._messagesService.getPosts(groupId!, {
              number: this._chunkNumber,
              size: CHUNK_SIZE,
            }).pipe(
              takeUntilDestroyed(this._destroyRef),
              switchMap(v => of(createGroups(v, this._proxyCollection, locale!, localization!))),
            );
          }),
          catchError((err) => {
            return throwError(() => {
              return `Get message chunk error: ${err}`;
            });
          }),
          takeUntilDestroyed(this._destroyRef),
          switchMap(res => {
            const items = Array.isArray(res.items) ? res.items : [];
            validateCollection(items);

            this._proxyCollection.from(items, true);
            const configMap = {};
            fillConfigMap(configMap, this._proxyCollection.collection);
            this.collectionConfigMap.set(configMap);

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

    $groupId.pipe(
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

    $groupId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(groupId => {
        return $scrollReachEnd.pipe(
          takeUntilDestroyed(this._destroyRef),
          filter(() => !this.isLoading()),
          switchMap(() => {
            this.isLazyLoading.set(true);
            return this._messagesService.getPosts(groupId, {
              number: this._chunkNumber + 1,
              size: CHUNK_SIZE,
            }).pipe(
              takeUntilDestroyed(this._destroyRef),
              switchMap(v => of(createGroups(v, this._proxyCollection, locale!, localization!))),
            );
          }),
          catchError((err) => {
            return throwError(() => {
              return `Get message chunk error: ${err}`;
            });
          }),
          tap(res => {
            this.isLazyLoading.set(false);
            const items = Array.isArray(res.items) ? res.items : [];
            this._chunkNumber++;
            validateCollection(items);

            this._proxyCollection.from(items, true);
            const configMap = {};
            fillConfigMap(configMap, this._proxyCollection.collection);
            this.collectionConfigMap.set(configMap);
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

  onChangeItemHandler(api: NtListPublicService, { item, config, value }:
    {
      nativeEvent: any, config: IDisplayObjectConfig, item: IVirtualListItem<IProxyCollectionItem<IFileViewerItemData>>, value: string | undefined,
    }) {
    this._$change.next({ item, api, config, value });
  }

  onScrollReachEndHandler() {
    this._$scrollReachEnd.next(undefined);
  }

  onSelectItemHandler(ids: Array<Id> | Id | null) {
    this.selectedIds.set(Array.isArray(ids) ? ids : []);
  }

  onEditingCancelHandler(item: IVirtualListItem<IFileViewerItemData>) {
    this._proxyCollection.setParams(item.id, { edited: false, });
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

  onQuoteSelectHandler(id: Id | null) {
    const list = this._list();
    if (list && id !== null) {
      list.scrollTo(id);
    }
  }

  ngOnDestroy(): void {
    if (this._proxyCollection) {
      this._proxyCollection.dispose();
    }
  }
}
