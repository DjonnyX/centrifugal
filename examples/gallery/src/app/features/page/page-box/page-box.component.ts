import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, effect, ElementRef, inject, input, OnDestroy, signal, Signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, tap } from 'rxjs';
import { IDisplayObjectConfig, IDisplayObjectMeasures, ISize, IVirtualListItem, NtListPublicService } from 'centrifugal';
import { IGalleryImageData } from "@shared/models/pages";
import { GradientColorPositions } from '@shared/types';
import { ThemeService } from '@shared/theming';
import { ContextMenuPresets } from '@shared/theming/themes/presets';
import { ITheme } from '@shared/theming';
import { ILocalization, LocalizationService, LocaleSensitiveDirective, TextDirections } from '@shared/localization';
import { IProxyCollectionItem } from '@widgets/gallery/gallery/utils/proxy-collection';
import { PageComponent } from '../page/page.component';
import { IPageParams } from '../page/interfaces';

const CLASS_RESETED = 'reseted', CLASS_SIMPLE = 'simple',
  CLASS_RTL = TextDirections.RTL,
  CONFIG_PROP_PREPARED = 'prepared';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-page-box',
  imports: [CommonModule, PageComponent, LocaleSensitiveDirective],
  templateUrl: './page-box.component.html',
  styleUrl: './page-box.component.scss'
})
export class PageBoxComponent implements AfterViewInit, OnDestroy {
  private _container = viewChild<ElementRef<HTMLDivElement>>('container');

  api = input<NtListPublicService>();

  data = input<IVirtualListItem<IProxyCollectionItem<IGalleryImageData>> | null>(null);

  prevData = input<IVirtualListItem<IProxyCollectionItem<IGalleryImageData>> | null>(null);

  nextData = input<IVirtualListItem<IProxyCollectionItem<IGalleryImageData>> | null>(null);

  config = input<IDisplayObjectConfig & { [prop: string]: any } | null>(null);

  measures = input<IDisplayObjectMeasures | null>(null);

  reseted = input<boolean>(false);

  private tmpValue = signal<string | undefined>(undefined);

  contextMenuPreset = signal<ContextMenuPresets>(ContextMenuPresets.PRIMARY);

  initialized = signal<boolean>(false);

  classes: Signal<{ [className: string]: boolean; }>;

  params: Signal<IPageParams>;

  theme: Signal<ITheme | undefined>;

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
        if (this._resizeObserver) {
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
      };
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

      const config = this.config() as any;
      return {
        [CLASS_SIMPLE]: true,
        [CONFIG_PROP_PREPARED]: config.prepared, [CLASS_RTL]: this._localizationService.textDirection === TextDirections.RTL,
      };
    });

    effect(() => {
      const data = this.data(), config = this.config(), theme = this.theme(), containerElement = this._container()?.nativeElement;
      if (data && config && theme && containerElement) {
        const preset = this._themeService.getPreset(theme.imageGallery.images.image.container);
        containerElement.style.backgroundColor = preset.normal.background;
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
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = undefined;
    }
  }
}
