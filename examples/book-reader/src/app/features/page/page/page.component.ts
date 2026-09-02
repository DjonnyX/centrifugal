import { CommonModule } from '@angular/common';
import {
  Component, computed, effect, ElementRef, inject, input, signal, Signal, viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  PageSubstrateComponent, TextComponent, PageSubstarateStyle, PageSubstarateStyles,
} from '@entities/page';
import { IDisplayObjectConfig, IDisplayObjectMeasures, IVirtualListItem, NtListPublicService } from 'centrifugal';
import { IBookPageData } from "@shared/models/pages";
import { Color, GradientColor, GradientColorPositions } from '@shared/types';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { IProxyCollectionItem } from '@widgets/reader/reader/utils/proxy-collection';
import { IPageParams } from './interfaces/page-params';

const DEFAULT_STROKE_ANIMATION_DURATION = 1000,
  LINE_HEIGHT = 14,
  DEFAULT_STROKE_WIDTH = 3,
  DEFAULT_MAX_DISTANCE = 40,
  DEFAULT_STROKE_COLOR: GradientColor = ['rgba(255,255,255,0)', 'rgba(195, 0, 255, 0.17)'],
  DEFAULT_FILL_COLOR: GradientColor = ['rgb(255, 255, 255)', 'rgb(185, 210, 233)'];

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-page',
  imports: [CommonModule, TextComponent, PageSubstrateComponent,],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  host: {
    'class': 'page',
  },
  encapsulation: ViewEncapsulation.Emulated,
})
export class PageComponent {
  private _container = viewChild<ElementRef<HTMLDivElement>>('container');

  api = input<NtListPublicService>();

  data = input<IVirtualListItem<IProxyCollectionItem<IBookPageData>> | null>(null);

  config = input<IDisplayObjectConfig | null>(null);

  measures = input<IDisplayObjectMeasures | null>(null);

  params = input.required<IPageParams>();

  searchPattern = input<Array<string>>([]);

  classes = input.required<{ [className: string]: boolean; }>();

  fillPositions = input<GradientColorPositions>();

  substrateType = signal<PageSubstarateStyle>(PageSubstarateStyles.NONE);

  strokeAnimationDuration = signal<number>(DEFAULT_STROKE_ANIMATION_DURATION);

  substrateStyles = signal<{ [styleName: string]: any; }>({});

  strokeColor = signal<GradientColor | undefined>(undefined);

  strokeWidth = signal<number>(DEFAULT_STROKE_WIDTH);

  fillColors = signal<GradientColor>(DEFAULT_FILL_COLOR);

  rippleColor = signal<Color | undefined>(undefined);

  textHeight = signal<number>(this.measures()?.height ?? 0);

  width: Signal<number>;

  height: Signal<number>;

  theme: Signal<ITheme | undefined>;

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _themeService = inject(ThemeService);

  readonly maxStaticClickDistance = DEFAULT_MAX_DISTANCE;

  someCondition = true;

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

    this.width = computed(() => {
      const w = this.measures()?.width ?? 0;
      return w;
    });

    this.height = computed(() => {
      const h = this.measures()?.height ?? 0;
      return h - 1;
    });

    effect(() => {
      const h = this.measures()?.height ?? 0;
      this.textHeight.set(Math.floor((h - 90) / LINE_HEIGHT) * LINE_HEIGHT);
    });

    effect(() => {
      const classes = this.classes(), element = this._elementRef?.nativeElement as HTMLElement;
      if (element) {
        if (classes) {
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

    effect(() => {
      const data = this.data(), currentTheme = this.theme();
      if (data && currentTheme) {
        this.substrateType.set(PageSubstarateStyles.NONE);
        this.strokeColor.set(DEFAULT_STROKE_COLOR);
      } else {
        this.substrateType.set(PageSubstarateStyles.NONE);
        this.strokeColor.set(DEFAULT_STROKE_COLOR);
      }
    });

    effect(() => {
      const theme = this.theme();
      if (theme) {
        const preset = this._themeService.getPreset(theme?.bookReader.messages.message.content);
        if (preset) {
          this.rippleColor.set(preset.rippleColor);
        }
      }
    });

    effect(() => {
      const currentTheme = this.theme(), containerElement = this._container()?.nativeElement;
      if (containerElement) {
        const preset = this._themeService.getPreset(currentTheme?.bookReader.messages.message.content);
        if (preset) {
          this.fillColors.set(preset.normal.fill ?? DEFAULT_FILL_COLOR);
          this.strokeWidth.set(preset.normal.strokeWidth ?? DEFAULT_STROKE_WIDTH);
          containerElement.style.color = preset.normal.color;
        }
      }
    });
  }
}
