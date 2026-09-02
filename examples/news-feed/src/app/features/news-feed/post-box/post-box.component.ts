import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, effect, ElementRef, inject, input, OnDestroy, signal, Signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, tap } from 'rxjs';
import { IDisplayObjectConfig, IDisplayObjectMeasures, ISize, IVirtualListItem, NtListPublicService } from 'centrifugal';
import { IPostItemData } from "@shared/models/message";
import { GradientColorPositions } from '@shared/types';
import { ThemeService } from '@shared/theming';
import { ContextMenuPresets } from '@shared/theming/themes/presets';
import { ITheme } from '@shared/theming';
import { ILocalization, LocalizationService, LocaleSensitiveDirective, TextDirections } from '@shared/localization';
import { IProxyCollectionItem } from '@widgets/news-feed/posts/utils/proxy-collection';
import { PostComponent } from '../post/post.component';
import { IPostParams } from '../post/interfaces';
import { MessageTypes } from '@shared/enums';

const CLASS_RESETED = 'reseted', CLASS_SIMPLE = 'simple', CLASS_ANIMATE = 'animate', CLASS_RTL = TextDirections.RTL,
  CLASS_SELECTED = 'selected', CLASS_FOCUSED = 'focused', CLASS_FIRST_IN_GROUP = 'first-in-group', CLASS_LAST_IN_GROUP = 'last-in-group',
  CLASS_HAS_MULTICONTENT = 'has-multicontent', DATA_PROP_IMAGE = 'image', DATA_PROP_ANIMATE = 'animate', CONFIG_PROP_SELECTED = 'selected',
  CONFIG_PROP_PREPARED = 'prepared', CONFIG_PROP_FOCUSED = 'focused';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-post-box',
  imports: [CommonModule, PostComponent, LocaleSensitiveDirective],
  templateUrl: './post-box.component.html',
  styleUrl: './post-box.component.scss'
})
export class PostBoxComponent implements AfterViewInit, OnDestroy {
  private _container = viewChild<ElementRef<HTMLDivElement>>('container');

  api = input<NtListPublicService>();

  data = input<IVirtualListItem<IProxyCollectionItem<IPostItemData>> | null>(null);

  prevData = input<IVirtualListItem<IProxyCollectionItem<IPostItemData>> | null>(null);

  nextData = input<IVirtualListItem<IProxyCollectionItem<IPostItemData>> | null>(null);

  config = input<IDisplayObjectConfig & { [prop: string]: any } | null>(null);

  measures = input<IDisplayObjectMeasures | null>(null);

  reseted = input<boolean>(false);

  searchPattern = input<Array<string>>([]);

  private tmpValue = signal<string | undefined>(undefined);

  contextMenuPreset = signal<ContextMenuPresets>(ContextMenuPresets.PRIMARY);

  initialized = signal<boolean>(false);

  classes: Signal<{ [className: string]: boolean; }>;

  params: Signal<IPostParams>;

  theme: Signal<ITheme | undefined>;

  fillPositions: Signal<GradientColorPositions>;

  isMessageValid: Signal<boolean>;

  localization: Signal<ILocalization | undefined>;

  locale: Signal<string | undefined>;

  private _themeService = inject(ThemeService);

  private _localizationService = inject(LocalizationService);

  private _resizeObserver: ResizeObserver | undefined;

  bounds = signal<ISize>({
    width: this._container()?.nativeElement?.offsetWidth || 0,
    height: this._container()?.nativeElement?.offsetHeight || 0,
  });

  private _onContainerResizeHandler = () => {
    const el = this._container()?.nativeElement as HTMLDivElement;
    if (el) {
      const width = el.offsetWidth, height = el.offsetHeight, bounds = this.bounds();
      if (bounds.width === width && bounds.height === height) {
        return;
      }
      this.bounds.set({ width, height });
    }
  }

  constructor() {
    this.localization = toSignal(this._localizationService.$localization);
    this.locale = toSignal(this._localizationService.$locale);
    const $container = toObservable(this._container), $data = toObservable(this.data);

    this._resizeObserver = new ResizeObserver(this._onContainerResizeHandler);

    $container.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
      tap(container => {
        if (!!this._resizeObserver) {
          this._resizeObserver.observe(container, { box: "border-box" });
        }
        this._onContainerResizeHandler();
      }),
    ).subscribe();

    this.theme = toSignal(this._themeService.$theme);

    this.params = computed(() => {
      const locale = this.locale(), reseted = this.reseted(), initialized = this.initialized(), data = this.data(),
        prevData = this.prevData(), nextData = this.nextData();
      return {
        reseted: !initialized || reseted,
        isRTL: this._localizationService.textDirection === TextDirections.RTL,
        type: data?.data.type,
        prevType: prevData?.data.type,
        nextType: nextData?.data.type,
      };
    });

    this.fillPositions = computed(() => {
      const measures = this.measures();
      return [`${measures?.absoluteStartPositionPercent ?? 0}`, `${(measures?.absoluteEndPositionPercent ?? 0)}`];
    });

    this.isMessageValid = computed(() => {
      const data = this.data(), tmpValue = this.tmpValue();
      return (!!data && data.data.text?.length > 0) && (tmpValue !== undefined && tmpValue.length > 0);
    });

    this.classes = computed(() => {
      const params = this.params(), { reseted } = params, initialized = this.initialized();
      if (reseted) {
        return { [CLASS_RESETED]: !initialized || reseted, } as any;
      }

      const data = this.data(), config = this.config() as any,
        firstInGroup = params.prevType === MessageTypes.GROUP && params.type !== MessageTypes.GROUP,
        lastInGroup = params.nextType === MessageTypes.GROUP && params.type !== MessageTypes.GROUP;
      return {
        [CLASS_SIMPLE]: true,
        [CLASS_ANIMATE]: data?.[DATA_PROP_ANIMATE] == true,
        [CLASS_FIRST_IN_GROUP]: firstInGroup, [CLASS_LAST_IN_GROUP]: lastInGroup, [CONFIG_PROP_PREPARED]: config.prepared,
        [CLASS_RTL]: this._localizationService.textDirection === TextDirections.RTL, [CLASS_SELECTED]: config?.[CONFIG_PROP_SELECTED],
        [CLASS_FOCUSED]: config?.[CONFIG_PROP_FOCUSED], [CLASS_HAS_MULTICONTENT]: data?.[DATA_PROP_IMAGE] !== undefined,
      };
    });

    effect(() => {
      const data = this.data(), config = this.config(), theme = this.theme(), containerElement = this._container()?.nativeElement;
      if (!!data && !!config && !!theme && !!containerElement) {
        const preset = this._themeService.getPreset(theme.newsFeed.posts.post.container);
        if (data.edited) {
          containerElement.style.backgroundColor = preset.edited.background;
        } else if (config.selected) {
          containerElement.style.backgroundColor = preset.selected.background;
        } else {
          containerElement.style.backgroundColor = preset.normal.background;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.initialized.set(true);
  }

  onResourcesLoadedHandler() {
    // etc
  }

  ngOnDestroy(): void {
    if (!!this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = undefined;
    }
  }
}
