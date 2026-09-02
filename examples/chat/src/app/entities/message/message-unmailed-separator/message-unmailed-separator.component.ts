import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, input, OnDestroy, signal, Signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, Subject, tap } from 'rxjs';
import { PressDirective } from '@shared/directives';
import { ILocalization, LocaleSensitiveDirective, LocalizationService } from '@shared/localization';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { Color, GradientColor, GradientColorPositions, RoundedCorner } from '@shared/types';
import { SubstrateModule } from '@shared/components/substrate/substrate.module';
import { ISize, IDisplayObjectMeasures } from 'centrifugal';

const FOCUSED = 'focused',
  SELECTED = 'selected',
  DEFAULT_SIZE = 28,
  DEFAUTL_RIPPLE_COLOR: Color = "rgba(0, 0, 0, 0)",
  DEFAULT_FILL_COLOR: GradientColor = ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0)"],
  DEFAULT_ROUND_CORNER: RoundedCorner = [14, 14, 14, 14];

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-message-unmailed-separator',
  imports: [CommonModule, LocaleSensitiveDirective, PressDirective, SubstrateModule],
  templateUrl: './message-unmailed-separator.component.html',
  styleUrl: './message-unmailed-separator.component.scss',
})
export class MessageUnmailedSeparatorComponent implements OnDestroy {
  private _container = viewChild<ElementRef<HTMLSpanElement>>('container');

  text: Signal<string>;

  classes = input<{ [className: string]: boolean; }>();

  measures = input<IDisplayObjectMeasures | null>(null);

  roundCorner = signal<RoundedCorner | undefined>(DEFAULT_ROUND_CORNER);

  strokeGradientColor = signal<GradientColor | undefined>(undefined);

  fillPositions: Signal<GradientColorPositions | undefined>;

  fillGradientColors = signal<GradientColor | undefined>(DEFAULT_FILL_COLOR);

  shapeRoundCorner = signal<[number, number, number, number] | undefined>(this.roundCorner());

  rippleEffectColor = signal<Color | undefined>(DEFAUTL_RIPPLE_COLOR);

  theme: Signal<ITheme | undefined>;

  private _$pressed = new Subject<boolean>();
  protected $pressed = this._$pressed.asObservable();

  private _themeService = inject(ThemeService);

  localization: Signal<ILocalization | undefined>;

  private _localizationService = inject(LocalizationService);

  private _resizeObserver: ResizeObserver | undefined;

  bounds = signal<ISize>({
    width: this._container()?.nativeElement?.offsetWidth || DEFAULT_SIZE,
    height: this._container()?.nativeElement?.offsetHeight || DEFAULT_SIZE,
  });

  private _onContainerResizeHandler = () => {
    const el = this._container()?.nativeElement as HTMLDivElement;
    if (el && el.offsetWidth && el.offsetHeight) {
      this.bounds.set({ width: el.offsetWidth || DEFAULT_SIZE, height: el.offsetHeight || DEFAULT_SIZE });
    }
  }

  constructor() {
    this.localization = toSignal(this._localizationService.$localization);

    this.text = computed(() => {
      const localization = this.localization();
      return localization ? localization.chat.messages.unmailedSeparator : '';
    });

    this._resizeObserver = new ResizeObserver(this._onContainerResizeHandler);

    const $container = toObservable(this._container);

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

    this.fillPositions = computed(() => {
      const measures = this.measures();
      return [`${measures?.absoluteStartPositionPercent ?? 0}`, `${(measures?.absoluteEndPositionPercent ?? 0)}`];
    });

    effect(() => {
      const theme = this.theme();
      if (theme) {
        const preset = this._themeService.getPreset(theme.chat.messages.group);
        if (preset) {
          this.rippleEffectColor.set(preset.rippleColor);
        }
      }
    });

    effect(() => {
      const theme = this.theme(), classes = this.classes(), nameElement = this._container()?.nativeElement;
      if (theme && nameElement && classes) {
        const preset = this._themeService.getPreset(theme.chat.messages.unmailedSeparator);
        if (preset) {
          if (classes[FOCUSED] && classes[SELECTED]) {
            this.fillGradientColors.set(preset.focusedSelected.background ?? DEFAULT_FILL_COLOR);
            nameElement.style.color = preset.focusedSelected.color;
            nameElement.style.borderColor = preset.focusedSelected.borderColor;
          } else if (classes[FOCUSED]) {
            this.fillGradientColors.set(preset.focused.background ?? DEFAULT_FILL_COLOR);
            nameElement.style.color = preset.focused.color;
            nameElement.style.borderColor = preset.focused.borderColor;
          } else if (classes[SELECTED]) {
            this.fillGradientColors.set(preset.selected.background ?? DEFAULT_FILL_COLOR);
            nameElement.style.color = preset.selected.color;
            nameElement.style.borderColor = preset.selected.borderColor;
          } else {
            this.fillGradientColors.set(preset.normal.background ?? DEFAULT_FILL_COLOR);
            nameElement.style.color = preset.normal.color;
            nameElement.style.borderColor = preset.normal.borderColor;
          }
        }
      }
    });
  }

  onPressHandler(pressed: boolean) {
    this._$pressed.next(pressed);
  }

  ngOnDestroy(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = undefined;
    }
    this._$pressed.complete();
  }
}
