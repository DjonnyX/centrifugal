import { AfterViewInit, Component, DestroyRef, effect, ElementRef, inject, input, OnDestroy, output, Signal, signal, viewChild } from '@angular/core';
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
  selector: 'x-button',
  imports: [
    CommonModule,
    SubstrateModule,
    PressDirective,
    LocaleSensitiveDirective,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent implements AfterViewInit, OnDestroy {
  button = viewChild<ElementRef<HTMLButtonElement>>('button');

  mode = input<SubstarateMode>(SubstarateModes.ROUNDED_RECTANGLE);

  type = input<SubstarateStyle>(SubstarateStyles.NONE);

  name = input<string | undefined>(undefined);

  content = input<string | undefined>();

  strokeColor = input<GradientColor | undefined>(undefined);

  strokeWidth = input<number>(DEFAULT_STROKE_WIDTH);

  roundCorner = input<RoundedCorner | undefined>(DEFAULT_ROUND_CORNER);

  disabled = input<boolean>(false);

  fillColors = input<GradientColor | undefined>(undefined);

  fillPositions = input<GradientColorPositions | undefined>(undefined);

  rippleColor = input<Color | undefined>(undefined);

  preset = input<ButtonPresets | string | undefined>(undefined);

  onClick = output<Event>();

  onFocus = output<boolean>();

  onPress = output<boolean>();

  readonly bounds = signal<ISize>({ width: 0, height: 0 });

  pressed = signal<boolean>(false);

  focused = signal<boolean>(false);

  strokeGradientColor = signal<GradientColor | undefined>(this.strokeColor());

  fillGradientColors = signal<GradientColor | undefined>(this.fillColors());

  shapeRoundCorner = signal<[number, number, number, number] | undefined>(this.roundCorner());

  rippleEffectColor = signal<Color | undefined>(this.rippleColor());

  theme: Signal<ITheme | undefined>;

  private _$pressed = new Subject<boolean>();
  protected $pressed = this._$pressed.asObservable();

  private _resizeObserer: ResizeObserver | undefined;

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _themeService = inject(ThemeService);

  private _destroyRef = inject(DestroyRef);

  private _onResizeHandler = () => {
    const el = this._elementRef.nativeElement as HTMLDivElement,
      { width, height } = el.getBoundingClientRect();
    this.bounds.set({ width, height });
  };

  constructor() {
    const el = this._elementRef.nativeElement as HTMLDivElement, $button = toObservable(this.button);
    this._resizeObserer = new ResizeObserver(this._onResizeHandler);
    this._resizeObserer.observe(el);

    const $pressed = this.$pressed;

    $pressed.pipe(
      takeUntilDestroyed(),
      delay(300),
      takeUntilDestroyed(),
      tap(v => {
        this.pressed.set(v);
        this.onPress.emit(v);
      }),
    ).subscribe();

    this.theme = toSignal(this._themeService.$theme);

    $button.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
      switchMap(button => {
        return fromEvent(button, FOCUS).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.focused.set(true);
            this.onFocus.emit(true);
          }),
          switchMap(() => {
            return fromEvent(button, BLUR).pipe(
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
      const buttonPreset = this._themeService.getPreset(preset);
      if (buttonPreset) {
        const el = this._elementRef.nativeElement as HTMLDivElement,
          elBtn = this.button()?.nativeElement as HTMLButtonElement;
        if (el && elBtn) {
          this.rippleEffectColor.set(buttonPreset.rippleColor ?? rippleColor);
          const disabled = this.disabled(), pressed = this.pressed(), focused = this.focused();
          if (disabled && buttonPreset.disabled) {
            this.shapeRoundCorner.set(buttonPreset.disabled.roundedCorner ?? roundedCorner);
            this.fillGradientColors.set(buttonPreset.disabled.fill ?? fillColors);
            this.strokeGradientColor.set(buttonPreset.disabled.strokeGradientColor ?? strokeColor);
            el.style.color = buttonPreset.disabled.color ? buttonPreset.disabled.color : INHERIT;
            elBtn.style.padding = buttonPreset.disabled.padding ? buttonPreset.disabled.padding : UNSET;
            elBtn.style.outline = buttonPreset.disabled.outline ? buttonPreset.disabled.outline : UNSET;
            elBtn.style.borderTopLeftRadius = buttonPreset.disabled.roundedCorner ? formatCSSNumber(buttonPreset.disabled.roundedCorner[0]) : UNSET;
            elBtn.style.borderBottomLeftRadius = buttonPreset.disabled.roundedCorner ? formatCSSNumber(buttonPreset.disabled.roundedCorner[1]) : UNSET;
            elBtn.style.borderBottomRightRadius = buttonPreset.disabled.roundedCorner ? formatCSSNumber(buttonPreset.disabled.roundedCorner[2]) : UNSET;
            elBtn.style.borderTopRightRadius = buttonPreset.disabled.roundedCorner ? formatCSSNumber(buttonPreset.disabled.roundedCorner[3]) : UNSET;
          } else if (focused && buttonPreset.focused) {
            this.shapeRoundCorner.set(buttonPreset.focused.roundedCorner ?? roundedCorner);
            this.fillGradientColors.set(buttonPreset.focused.fill ?? fillColors);
            this.strokeGradientColor.set(buttonPreset.focused.strokeGradientColor ?? strokeColor);
            el.style.color = buttonPreset.focused.color ? buttonPreset.focused.color : INHERIT;
            elBtn.style.padding = buttonPreset.focused.padding ? buttonPreset.focused.padding : UNSET;
            elBtn.style.outline = buttonPreset.focused.outline ? buttonPreset.focused.outline : UNSET;
            elBtn.style.borderTopLeftRadius = buttonPreset.focused.roundedCorner ? formatCSSNumber(buttonPreset.focused.roundedCorner[0]) : UNSET;
            elBtn.style.borderBottomLeftRadius = buttonPreset.focused.roundedCorner ? formatCSSNumber(buttonPreset.focused.roundedCorner[1]) : UNSET;
            elBtn.style.borderBottomRightRadius = buttonPreset.focused.roundedCorner ? formatCSSNumber(buttonPreset.focused.roundedCorner[2]) : UNSET;
            elBtn.style.borderTopRightRadius = buttonPreset.focused.roundedCorner ? formatCSSNumber(buttonPreset.focused.roundedCorner[3]) : UNSET;
          } else if (pressed && buttonPreset.pressed) {
            this.shapeRoundCorner.set(buttonPreset.pressed.roundedCorner ?? roundedCorner);
            this.fillGradientColors.set(buttonPreset.pressed.fill ?? fillColors);
            this.strokeGradientColor.set(buttonPreset.pressed.strokeGradientColor ?? strokeColor);
            el.style.color = buttonPreset.pressed.color ? buttonPreset.pressed.color : INHERIT;
            elBtn.style.padding = buttonPreset.pressed.padding ? buttonPreset.pressed.padding : UNSET;
            elBtn.style.outline = buttonPreset.pressed.outline ? buttonPreset.pressed.outline : UNSET;
            elBtn.style.borderTopLeftRadius = buttonPreset.pressed.roundedCorner ? formatCSSNumber(buttonPreset.pressed.roundedCorner[0]) : UNSET;
            elBtn.style.borderBottomLeftRadius = buttonPreset.pressed.roundedCorner ? formatCSSNumber(buttonPreset.pressed.roundedCorner[1]) : UNSET;
            elBtn.style.borderBottomRightRadius = buttonPreset.pressed.roundedCorner ? formatCSSNumber(buttonPreset.pressed.roundedCorner[2]) : UNSET;
            elBtn.style.borderTopRightRadius = buttonPreset.pressed.roundedCorner ? formatCSSNumber(buttonPreset.pressed.roundedCorner[3]) : UNSET;
          } else {
            this.shapeRoundCorner.set(buttonPreset.normal.roundedCorner ?? roundedCorner);
            this.fillGradientColors.set(buttonPreset.normal.fill ?? fillColors);
            this.strokeGradientColor.set(buttonPreset.normal.strokeGradientColor ?? strokeColor);
            el.style.color = buttonPreset.normal.color ? buttonPreset.normal.color : INHERIT;
            elBtn.style.padding = buttonPreset.normal.padding ? buttonPreset.normal.padding : UNSET;
            elBtn.style.outline = buttonPreset.normal.outline ? buttonPreset.normal.outline : UNSET;
            elBtn.style.borderTopLeftRadius = buttonPreset.normal.roundedCorner ? formatCSSNumber(buttonPreset.normal.roundedCorner[0]) : UNSET;
            elBtn.style.borderBottomLeftRadius = buttonPreset.normal.roundedCorner ? formatCSSNumber(buttonPreset.normal.roundedCorner[1]) : UNSET;
            elBtn.style.borderBottomRightRadius = buttonPreset.normal.roundedCorner ? formatCSSNumber(buttonPreset.normal.roundedCorner[2]) : UNSET;
            elBtn.style.borderTopRightRadius = buttonPreset.normal.roundedCorner ? formatCSSNumber(buttonPreset.normal.roundedCorner[3]) : UNSET;
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


