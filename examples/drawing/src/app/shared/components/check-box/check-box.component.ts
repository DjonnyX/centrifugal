import { AfterViewInit, Component, computed, DestroyRef, effect, ElementRef, inject, input, OnDestroy, output, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { delay, filter, fromEvent, map, Subject, switchMap, tap } from 'rxjs';
import { Color, GradientColor, GradientColorPositions, RoundedCorner } from '@shared/types';
import { ButtonPresets, ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { PressDirective } from '@shared/directives';
import { SubstarateMode, SubstarateStyle, SubstarateModes, SubstarateStyles } from '../substrate';
import { ISize } from 'ng-virtual-list';
import { formatCSSNumber } from '../utils';
import { LocaleSensitiveDirective } from '@shared/localization';
import { SubstrateModule } from '../substrate/substrate.module';

const DEFAULT_ROUND_CORNER: RoundedCorner = [8, 8, 8, 8],
  DEFAULT_STROKE_WIDTH = 3,
  CLASS_PRESSED = 'pressed',
  CLASS_FOCUSED = 'focused',
  CLASS_DISABLED = 'disabled',
  INHERIT = 'inherit',
  UNSET = 'unset',
  FOCUS = 'focus',
  BLUR = 'blur';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-check-box',
  imports: [
    CommonModule,
    SubstrateModule,
    PressDirective,
    LocaleSensitiveDirective,
  ],
  templateUrl: './check-box.component.html',
  styleUrl: './check-box.component.scss',
})
export class CheckBoxComponent implements AfterViewInit, OnDestroy {
  checkbox = viewChild<ElementRef<HTMLButtonElement>>('checkbox');

  label = viewChild<ElementRef<HTMLParagraphElement>>('label');

  indicator = viewChild<ElementRef<HTMLSpanElement>>('indicator');

  mode = input<SubstarateMode>(SubstarateModes.ROUNDED_RECTANGLE);

  type = input<SubstarateStyle>(SubstarateStyles.NONE);

  content = input<string | undefined>();

  checked = input<boolean>(false);

  indicatorFadeOut = signal<boolean>(false);

  indicatorHide = signal<boolean>(false);

  indicatorClasses: Signal<{ [cName: string]: boolean }>;

  onCheck = output<boolean>();

  strokeColor = input<GradientColor | undefined>(undefined);

  strokeWidth = input<number>(DEFAULT_STROKE_WIDTH);

  roundCorner = input<RoundedCorner | undefined>(DEFAULT_ROUND_CORNER);

  disabled = input<boolean>(false);

  pressed = signal<boolean>(false);

  fillColors = input<GradientColor | undefined>(undefined);

  fillPositions = input<GradientColorPositions | undefined>(undefined);

  rippleColor = input<Color | undefined>(undefined);

  preset = input<ButtonPresets | string | undefined>(undefined);

  onClick = output<Event>();

  onFocus = output<boolean>();

  onPress = output<boolean>();

  readonly bounds = signal<ISize>({ width: 0, height: 0 });

  focused = signal<boolean>(false);

  strokeGradientColor = signal<GradientColor | undefined>(this.strokeColor());

  fillGradientColors = signal<GradientColor | undefined>(this.fillColors());

  shapeRoundCorner = signal<[number, number, number, number] | undefined>(this.roundCorner());

  rippleEffectColor = signal<Color | undefined>(this.rippleColor());

  theme: Signal<ITheme | undefined>;

  value = signal<boolean>(true);

  private _$pressed = new Subject<boolean>();
  protected $pressed = this._$pressed.asObservable();

  private _resizeObserer: ResizeObserver | undefined;

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _themeService = inject(ThemeService);

  private _destroyRef = inject(DestroyRef);

  private _onResizeHandler = () => {
    const el = this.checkbox()?.nativeElement as HTMLButtonElement,
      { width, height } = el?.getBoundingClientRect();
    this.bounds.set({ width, height });
  };

  constructor() {
    const el = this._elementRef.nativeElement as HTMLDivElement, $checkbox = toObservable(this.checkbox);
    this._resizeObserer = new ResizeObserver(this._onResizeHandler);
    this._resizeObserer.observe(el);

    effect(() => {
      const checked = this.checked();
      this.value.set(checked);
    });

    effect(() => {
      const value = this.value();
      this.onCheck.emit(value);
    });

    const $pressed = this.$pressed,
      $value = toObservable(this.value);

    $pressed.pipe(
      takeUntilDestroyed(),
      delay(300),
      takeUntilDestroyed(),
      tap(v => {
        this.pressed.set(v);
        this.onPress.emit(v);
      }),
    ).subscribe();

    $value.pipe(
      takeUntilDestroyed(),
      tap(v => {
        if (!!v) {
          this.indicatorHide.set(false);
          this.indicatorFadeOut.set(false);
        } else {
          this.indicatorFadeOut.set(true);
          this.indicatorHide.set(false);
        }
      }),
      filter(v => v === false),
      delay(150),
      takeUntilDestroyed(this._destroyRef),
      tap(() => {
        this.indicatorHide.set(true);
      }),
    ).subscribe();

    this.theme = toSignal(this._themeService.$theme);

    $checkbox.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
      switchMap(checkbox => {
        return fromEvent(checkbox, FOCUS).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.focused.set(true);
            this.onFocus.emit(true);
          }),
          switchMap(() => {
            return fromEvent(checkbox, BLUR).pipe(
              takeUntilDestroyed(this._destroyRef),
              tap(() => {
                this.focused.set(false);
                this.onFocus.emit(false);
              }),
            );
          })
        );
      }),
    ).subscribe();

    this.indicatorClasses = computed(() => {
      const hide = this.indicatorHide(), fadeout = this.indicatorFadeOut();
      return { hide, fadeout };
    });

    effect(() => {
      const pressed = this.pressed(), focused = this.focused(), disabled = this.disabled();
      const el = this._elementRef.nativeElement as HTMLDivElement;
      if (pressed) {
        el.classList.add(CLASS_PRESSED);
      } else {
        el.classList.remove(CLASS_PRESSED);
      }
      if (focused) {
        el.classList.add(CLASS_FOCUSED);
      } else {
        el.classList.remove(CLASS_FOCUSED);
      }
      if (disabled) {
        el.classList.add(CLASS_DISABLED);
      } else {
        el.classList.remove(CLASS_DISABLED);
      }
    });

    effect(() => {
      this.applyStyles();
    });
  }

  ngAfterViewInit(): void {
    this._onResizeHandler();
  }

  private applyStyles(currentPreset?: string) {
    const preset = currentPreset ?? this.preset(), theme = this.theme(), strokeColor = this.strokeColor(), roundedCorner = this.roundCorner(),
      fillColors = this.fillColors(), rippleColor = this.rippleColor();
    if (theme && preset) {
      const checkboxPreset = this._themeService.getPreset(preset);
      if (checkboxPreset) {
        const el = this._elementRef.nativeElement as HTMLDivElement,
          checkboxElement = this.checkbox()?.nativeElement as HTMLButtonElement,
          indicatorElement = this.indicator()?.nativeElement as HTMLSpanElement,
          labelElement = this.label()?.nativeElement as HTMLSpanElement;
        if (el && checkboxElement && indicatorElement && labelElement) {
          this.rippleEffectColor.set(checkboxPreset.rippleColor ?? rippleColor);
          const disabled = this.disabled(), pressed = this.pressed(), focused = this.focused();
          if (disabled && checkboxPreset.disabled) {
            this.shapeRoundCorner.set(checkboxPreset.disabled.roundedCorner ?? roundedCorner);
            this.fillGradientColors.set(checkboxPreset.disabled.fill ?? fillColors);
            this.strokeGradientColor.set(checkboxPreset.disabled.strokeGradientColor ?? strokeColor);
            labelElement.style.color = checkboxPreset.disabled.color ? checkboxPreset.disabled.color : INHERIT;
            labelElement.style.fontSize = checkboxPreset.disabled.fontSize ? checkboxPreset.disabled.fontSize : INHERIT;
            indicatorElement.style.fill = checkboxPreset.disabled.iconFill ? checkboxPreset.disabled.iconFill : INHERIT;
            checkboxElement.style.padding = checkboxPreset.disabled.padding ? checkboxPreset.disabled.padding : UNSET;
            checkboxElement.style.outline = checkboxPreset.disabled.outline ? checkboxPreset.disabled.outline : UNSET;
            checkboxElement.style.borderTopLeftRadius = checkboxPreset.disabled.roundedCorner ? formatCSSNumber(checkboxPreset.disabled.roundedCorner[0]) : UNSET;
            checkboxElement.style.borderBottomLeftRadius = checkboxPreset.disabled.roundedCorner ? formatCSSNumber(checkboxPreset.disabled.roundedCorner[1]) : UNSET;
            checkboxElement.style.borderBottomRightRadius = checkboxPreset.disabled.roundedCorner ? formatCSSNumber(checkboxPreset.disabled.roundedCorner[2]) : UNSET;
            checkboxElement.style.borderTopRightRadius = checkboxPreset.disabled.roundedCorner ? formatCSSNumber(checkboxPreset.disabled.roundedCorner[3]) : UNSET;
          } else if (focused && checkboxPreset.focused) {
            this.shapeRoundCorner.set(checkboxPreset.focused.roundedCorner ?? roundedCorner);
            this.fillGradientColors.set(checkboxPreset.focused.fill ?? fillColors);
            this.strokeGradientColor.set(checkboxPreset.focused.strokeGradientColor ?? strokeColor);
            labelElement.style.color = checkboxPreset.focused.color ? checkboxPreset.focused.color : INHERIT;
            labelElement.style.fontSize = checkboxPreset.focused.fontSize ? checkboxPreset.focused.fontSize : INHERIT;
            indicatorElement.style.fill = checkboxPreset.focused.iconFill ? checkboxPreset.focused.iconFill : INHERIT;
            checkboxElement.style.padding = checkboxPreset.focused.padding ? checkboxPreset.focused.padding : UNSET;
            checkboxElement.style.outline = checkboxPreset.focused.outline ? checkboxPreset.focused.outline : UNSET;
            checkboxElement.style.borderTopLeftRadius = checkboxPreset.focused.roundedCorner ? formatCSSNumber(checkboxPreset.focused.roundedCorner[0]) : UNSET;
            checkboxElement.style.borderBottomLeftRadius = checkboxPreset.focused.roundedCorner ? formatCSSNumber(checkboxPreset.focused.roundedCorner[1]) : UNSET;
            checkboxElement.style.borderBottomRightRadius = checkboxPreset.focused.roundedCorner ? formatCSSNumber(checkboxPreset.focused.roundedCorner[2]) : UNSET;
            checkboxElement.style.borderTopRightRadius = checkboxPreset.focused.roundedCorner ? formatCSSNumber(checkboxPreset.focused.roundedCorner[3]) : UNSET;
          } else if (pressed && checkboxPreset.pressed) {
            this.shapeRoundCorner.set(checkboxPreset.pressed.roundedCorner ?? roundedCorner);
            this.fillGradientColors.set(checkboxPreset.pressed.fill ?? fillColors);
            this.strokeGradientColor.set(checkboxPreset.pressed.strokeGradientColor ?? strokeColor);
            labelElement.style.color = checkboxPreset.pressed.color ? checkboxPreset.pressed.color : INHERIT;
            labelElement.style.fontSize = checkboxPreset.pressed.fontSize ? checkboxPreset.pressed.fontSize : INHERIT;
            indicatorElement.style.fill = checkboxPreset.pressed.iconFill ? checkboxPreset.pressed.iconFill : INHERIT;
            checkboxElement.style.padding = checkboxPreset.pressed.padding ? checkboxPreset.pressed.padding : UNSET;
            checkboxElement.style.outline = checkboxPreset.pressed.outline ? checkboxPreset.pressed.outline : UNSET;
            checkboxElement.style.borderTopLeftRadius = checkboxPreset.pressed.roundedCorner ? formatCSSNumber(checkboxPreset.pressed.roundedCorner[0]) : UNSET;
            checkboxElement.style.borderBottomLeftRadius = checkboxPreset.pressed.roundedCorner ? formatCSSNumber(checkboxPreset.pressed.roundedCorner[1]) : UNSET;
            checkboxElement.style.borderBottomRightRadius = checkboxPreset.pressed.roundedCorner ? formatCSSNumber(checkboxPreset.pressed.roundedCorner[2]) : UNSET;
            checkboxElement.style.borderTopRightRadius = checkboxPreset.pressed.roundedCorner ? formatCSSNumber(checkboxPreset.pressed.roundedCorner[3]) : UNSET;
          } else {
            this.shapeRoundCorner.set(checkboxPreset.normal.roundedCorner ?? roundedCorner);
            this.fillGradientColors.set(checkboxPreset.normal.fill ?? fillColors);
            this.strokeGradientColor.set(checkboxPreset.normal.strokeGradientColor ?? strokeColor);
            labelElement.style.color = checkboxPreset.normal.color ? checkboxPreset.normal.color : INHERIT;
            labelElement.style.fontSize = checkboxPreset.normal.fontSize ? checkboxPreset.normal.fontSize : INHERIT;
            indicatorElement.style.fill = checkboxPreset.normal.iconFill ? checkboxPreset.normal.iconFill : INHERIT;
            checkboxElement.style.padding = checkboxPreset.normal.padding ? checkboxPreset.normal.padding : UNSET;
            checkboxElement.style.outline = checkboxPreset.normal.outline ? checkboxPreset.normal.outline : UNSET;
            checkboxElement.style.borderTopLeftRadius = checkboxPreset.normal.roundedCorner ? formatCSSNumber(checkboxPreset.normal.roundedCorner[0]) : UNSET;
            checkboxElement.style.borderBottomLeftRadius = checkboxPreset.normal.roundedCorner ? formatCSSNumber(checkboxPreset.normal.roundedCorner[1]) : UNSET;
            checkboxElement.style.borderBottomRightRadius = checkboxPreset.normal.roundedCorner ? formatCSSNumber(checkboxPreset.normal.roundedCorner[2]) : UNSET;
            checkboxElement.style.borderTopRightRadius = checkboxPreset.normal.roundedCorner ? formatCSSNumber(checkboxPreset.normal.roundedCorner[3]) : UNSET;
          }
          return;
        }
      }
    }
    this.rippleEffectColor.set(rippleColor);
    this.shapeRoundCorner.set(roundedCorner);
    this.fillGradientColors.set(fillColors);
    this.strokeGradientColor.set(strokeColor);
  }

  onPressHandler(pressed: boolean) {
    this._$pressed.next(pressed);
  }

  onClickHandler(e: Event) {
    this.value.update(v => !v);
    const disabled = this.disabled();
    if (disabled) {
      e.stopImmediatePropagation();
      return;
    }
    this.onClick.emit(e);
  }

  ngOnDestroy(): void {
    if (this._resizeObserer) {
      this._resizeObserer.disconnect();
      this._resizeObserer = undefined;
    }
    this._$pressed.complete();
  }
}


