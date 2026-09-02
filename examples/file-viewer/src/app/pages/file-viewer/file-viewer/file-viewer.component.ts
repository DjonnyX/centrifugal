import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, inject, OnDestroy, Signal, signal, ViewChild, viewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, debounceTime, filter, map, tap, } from 'rxjs';
import { MenuButtonComponent, SearchComponent } from '@entities/header';
import { DrawerDockPositions, IRenderVirtualListItem, ISize, IVirtualListItem, NtDrawerComponent, NtDrawerModule } from 'centrifugal';
import { ClickOutsideService } from '@shared/directives';
import { FileViewerItemsComponent } from "@widgets/file-viewer/file-viewer-items/file-viewer-items.component";
import { GroupsComponent } from "@widgets/groups/groups/groups.component";
import { ITheme } from '@shared/theming';
import { ThemeService } from '@shared/theming';
import { generateChatCollection } from '@mock/const';
import { IFileViewerItemData } from '@shared/models/message';
import { LocaleSensitiveDirective } from '@shared/localization';
import { ItemsService } from '@widgets/file-viewer/items.service';
import { ItemsMockService } from '@widgets/file-viewer/items-mock.service';
import { ItemsHttpService } from '@widgets/file-viewer/items-http.service';
import { environment } from '@environments/environment';
import { IMediaParams, MediaService } from '@shared/directives/media';
import { ItemService } from '@widgets/file-viewer/item.service';

const DEFAULT_MENU_SIZE = 320,
  COLLAPSIBLE_MENU_SIZES = ['xxs', 'xs', 's', 'sm', 'm', 'xm', 'xxm', 'l', 'xl'],
  MENU_SIZES: IMediaParams = {
    'xxs': 'col-12',
    'xs': 'col-12',
    's': 'col-12',
    'sm': 'col-12',
    'm': 'col-12',
    'xm': 'col-12',
    'xxm': DEFAULT_MENU_SIZE,
    'l': DEFAULT_MENU_SIZE,
    'xl': DEFAULT_MENU_SIZE,
    'xxl': DEFAULT_MENU_SIZE,
    undefined: DEFAULT_MENU_SIZE,
  };

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-file-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule, LocaleSensitiveDirective, MenuButtonComponent, SearchComponent,
    FileViewerItemsComponent, GroupsComponent, NtDrawerModule],
  templateUrl: './file-viewer.component.html',
  styleUrl: './file-viewer.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ClickOutsideService,
    { provide: ItemsService, useClass: environment.useMock ? ItemsMockService : ItemsHttpService },
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class FileViewer implements OnDestroy {
  protected _toolbar = viewChild<ElementRef<HTMLDivElement>>('toolbar');

  @ViewChild('items', { read: FileViewerItemsComponent })
  protected _items: FileViewerItemsComponent | undefined;

  protected _header = viewChild<ElementRef<HTMLDivElement>>('header');

  protected _drawer = viewChild<NtDrawerComponent>('drawer');

  private _$version = new BehaviorSubject<number>(0);
  readonly $version = this._$version.asObservable();

  isCreating = signal<boolean>(false);

  menuOpened = signal<boolean>(false);

  menuSize = signal<number>(DEFAULT_MENU_SIZE);

  theme: Signal<ITheme | undefined>;

  show = signal(true);

  search = signal('');

  items = generateChatCollection();

  title = signal<string | undefined>(undefined);

  private _itemService = inject(ItemService);

  private _mediaService = inject(MediaService);

  private _themeService = inject(ThemeService);

  private _toolbarResizeObserver: ResizeObserver;

  toolbarBounds = signal<ISize>({
    width: this._toolbar()?.nativeElement?.offsetWidth || 0,
    height: this._toolbar()?.nativeElement?.offsetHeight || 0,
  });

  private _onToolbarResizeHandler = () => {
    const el = this._toolbar()?.nativeElement as HTMLDivElement;
    if (el && el.offsetWidth && el.offsetHeight) {
      this.toolbarBounds.set({ width: el.offsetWidth || 0, height: el.offsetHeight || 0 });
    }
  }

  constructor() {
    this._toolbarResizeObserver = new ResizeObserver(this._onToolbarResizeHandler);

    this._mediaService.$changes.pipe(
      takeUntilDestroyed(),
      tap(({ size }) => {
        const val = this._mediaService.getMediaSize(MENU_SIZES) as number;
        this.menuSize.set(val !== undefined ? val : DEFAULT_MENU_SIZE);
      }),
    ).subscribe();

    const $toolbar = toObservable(this._toolbar).pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
    );

    $toolbar.pipe(
      takeUntilDestroyed(),
      tap(toolbar => {
        this._toolbarResizeObserver.observe(toolbar);
      }),
    ).subscribe();

    this.theme = toSignal(this._themeService.$theme);

    effect(() => {
      const theme = this.theme(), toolbar = this._toolbar()?.nativeElement;
      if (theme && toolbar) {
        const preset = this._themeService.getPreset(theme.fileViewer.header);
        if (!!preset) {
          toolbar.style.background = preset.background;
          toolbar.style.color = preset.color;
        }
      }
    });

    effect(() => {
      const theme = this.theme(), header = this._header()?.nativeElement;
      if (theme && header) {
        const preset = this._themeService.getPreset(theme.fileViewer.header);
        if (!!preset) {
          header.style.color = preset.color;
          header.style.fontSize = preset.fontSize;
        }
      }
    });

    const $opened = toObservable(this.menuOpened);

    $opened.pipe(
      takeUntilDestroyed(),
      debounceTime(100),
      tap(v => {
        if (v) {
          this._drawer()?.open(DrawerDockPositions.RIGHT);
        } else {
          this._drawer()?.close();
        }
      }),
    ).subscribe();
  }

  onSearchHandler(pattern: string) {
    this.search.set(pattern);
  }

  onClickHandler(item: IRenderVirtualListItem<IFileViewerItemData> | undefined) {
    if (item) {
      console.info(`Click: (ID: ${item.data.id}) Item ${item.data.text}`);
    }
  }

  onGroupSelectHandler(item: IVirtualListItem) {
    const groupId = `${item?.['id']}`;
    if (groupId !== this._itemService.groupId) {
      this._items?.hide();
      this.title.set(item?.['text']);
      this._itemService.changeChat(groupId);
    }
    this._drawer()?.close();
  }

  onInfo(params: Array<any>) {
    const [param1, param2, param3] = params;
    this.title.set(`${param1}, ${param2}, ${param3}`)
  }

  onDockClose() {
    this.menuOpened.set(false);
  }

  onGroupsCloseHandler() {
    this.menuOpened.set(false);
  }

  onOpenMenuHandler(e: Event) {
    e.stopImmediatePropagation();

    this.menuOpened.set(!this.menuOpened());
  }

  onDrawerOpenHandler() {
    this.menuOpened.set(true);
  }

  onDrawerCloseHandler() {
    this.menuOpened.set(false);
  }

  ngOnDestroy(): void {
    if (this._toolbarResizeObserver) {
      this._toolbarResizeObserver.disconnect();
    }
  }
}
