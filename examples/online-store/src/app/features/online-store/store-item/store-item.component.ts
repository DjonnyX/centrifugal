import { CommonModule } from '@angular/common';
import {
  Component, computed, effect, ElementRef, inject, input, signal, Signal, viewChild, ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { TextComponent } from '@entities/item';
import {
  Color, GradientColorPositions, IDisplayObjectConfig, IDisplayObjectMeasures, ISize, IVirtualListItem, NtListPublicService,
} from 'centrifugal';
import { IStoreItemData } from "@shared/models/message";
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { IProxyCollectionItem } from '@widgets/online-store/store-items/utils/proxy-collection';
import { IStoreItemParams } from './interfaces/store-item-params';
import { SubstrateModule } from '@shared/components/substrate/substrate.module';
import { GradientColor, RoundedCorner } from '@shared/types';

const DEFAULT_MAX_DISTANCE = 40,
  DEFAUTL_RIPPLE_COLOR: Color = "rgba(0, 0, 0, 0)",
  DEFAULT_FILL_COLOR: GradientColor = ["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)"],
  DEFAULT_ROUND_CORNER: RoundedCorner = [14, 14, 14, 14];

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-store-item',
  imports: [CommonModule, TextComponent, SubstrateModule],
  templateUrl: './store-item.component.html',
  styleUrl: './store-item.component.scss',
  host: {
    'class': 'store-item',
  },
  encapsulation: ViewEncapsulation.Emulated,
})
export class StoreItemComponent {
  private _container = viewChild<ElementRef<HTMLDivElement>>('container');

  api = input<NtListPublicService>();

  data = input<IVirtualListItem<IProxyCollectionItem<IStoreItemData>> | null>(null);

  config = input<IDisplayObjectConfig | null>(null);

  measures = input<IDisplayObjectMeasures | null>(null);

  roundCorner = signal<RoundedCorner | undefined>(DEFAULT_ROUND_CORNER);

  strokeGradientColor = signal<GradientColor | undefined>(undefined);

  fillPositions: Signal<GradientColorPositions | undefined>;

  fillGradientColors = signal<GradientColor | undefined>(DEFAULT_FILL_COLOR);

  shapeRoundCorner = signal<[number, number, number, number] | undefined>(this.roundCorner());

  rippleEffectColor = signal<any | undefined>(DEFAUTL_RIPPLE_COLOR);

  params = input.required<IStoreItemParams>();

  searchPattern = input<Array<string>>([]);

  classes = input.required<{ [className: string]: boolean; }>();

  stroke = signal<string | undefined>(undefined);

  iconsColor = signal<string>('initial');

  theme: Signal<ITheme | undefined>;

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _themeService = inject(ThemeService);

  readonly maxStaticClickDistance = DEFAULT_MAX_DISTANCE;

  private _resizeObserver: ResizeObserver | undefined;

  bounds = signal<ISize>({
    width: this._container()?.nativeElement?.offsetWidth || 0,
    height: this._container()?.nativeElement?.offsetHeight || 0,
  });

  private _onContainerResizeHandler = () => {
    const el = this._container()?.nativeElement as HTMLDivElement;
    const width = el.offsetWidth || 0, height = el.offsetHeight || 0, bounds = this.bounds();
    if (bounds.width === width && bounds.height === height) {
      return;
    }
    this.bounds.set({ width, height });
  }

  actualBounds: Signal<ISize>;

  someCondition = true;

  constructor() {
    this._resizeObserver = new ResizeObserver(this._onContainerResizeHandler);

    const $container = toObservable(this._container);

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

    const $listApi = toObservable(this.api),
      $tick = $listApi.pipe(
        takeUntilDestroyed(),
        distinctUntilChanged(),
        filter(v => !!v),
        switchMap(api => {
          return api.$tick;
        }),
      );

    $tick.pipe(
      takeUntilDestroyed(),
      tap(() => {
        this._onContainerResizeHandler();
      }),
    ).subscribe();

    this.fillPositions = computed(() => {
      const measures = this.measures();
      return [`${measures?.absoluteStartPositionPercent ?? 0}`, `${(measures?.absoluteEndPositionPercent ?? 0)}`];
    });

    effect(() => {
      const theme = this.theme();
      if (!!theme) {
        const preset = this._themeService.getPreset(theme.onlineStore.storeItems.storeItem.content);
        if (!!preset) {
          this.rippleEffectColor.set(preset.rippleColor);
        }
      }
    });

    effect(() => {
      const theme = this.theme(), nameElement = this._container()?.nativeElement;
      if (!!theme && !!nameElement) {
        const preset = this._themeService.getPreset(theme.onlineStore.storeItems.storeItem.content);
        if (!!preset) {
          this.fillGradientColors.set(preset.background ?? DEFAULT_FILL_COLOR);
          nameElement.style.color = preset.color;
          nameElement.style.borderColor = preset.borderColor;
        }
      }
    });

    effect(() => {
      const classes = this.classes(), element = this._elementRef?.nativeElement as HTMLElement;
      if (!!element) {
        if (!!classes) {
          for (const cName in classes) {
            if (classes[cName]) {
              element.classList.add(cName);
            } else {
              element.classList.remove(cName);
            }
          }
        }
      }
    });

    this.actualBounds = computed(() => {
      const bounds = this.bounds();
      if (!!bounds) {
        return { width: bounds.width || 0, height: bounds.height || 0 };
      }
      return { width: 0, height: 0 };
    });

    effect(() => {
      const config = this.config(), currentTheme = this.theme();
      if (!!config?.focused && !!currentTheme) {
        const preset = this._themeService.getPreset(currentTheme.onlineStore.storeItems.storeItem.styles);
        this.stroke.set(preset.focus.stroke);
      } else {
        this.stroke.set(undefined);
      }
    });

    effect(() => {
      const theme = this.theme();
      if (!!theme) {
        const preset = this._themeService.getPreset(theme.onlineStore.storeItems.storeItem.content.textEditor.comment);
        if (!!preset) {
          this.iconsColor.set(preset.color);
        }
      }
    });

    effect(() => {
      const currentTheme = this.theme(), containerElement = this._container()?.nativeElement;
      if (!!containerElement) {
        const preset = this._themeService.getPreset(currentTheme?.onlineStore.storeItems.storeItem.content);
        if (!!preset) {
          containerElement.style.color = preset.color;
        }
      }
    });
  }

  ngAfterViewInit() {
    this._onContainerResizeHandler();
  }
}
