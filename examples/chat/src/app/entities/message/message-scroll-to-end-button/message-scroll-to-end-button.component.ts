import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, HostListener, inject, input, output, Signal, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '@shared/components/button';
import { SubstarateStyle, SubstarateStyles } from '@shared/components/substrate';
import { ThemeService } from '@shared/theming';
import { Color, GradientColor, GradientColorPositions } from '@shared/types';

const DEFAULT_STROKE_COLOR: GradientColor = ['rgba(255,255,255,0)', 'rgb(255, 255, 255)'],
  DEFAULT_FILL_COLOR: GradientColor = ['rgb(255, 255, 255)', 'rgb(185, 210, 233)'];

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-message-scroll-to-end-button',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './message-scroll-to-end-button.component.html',
  styleUrl: './message-scroll-to-end-button.component.scss'
})
export class MessageScrollToEndButtonComponent {
  content = viewChild<ElementRef<HTMLDivElement>>('content');

  onClick = output<Event>();

  disabled = input<boolean>(false);

  fillPositions = input<GradientColorPositions>();

  buttonStrokeColor = signal<GradientColor>(DEFAULT_STROKE_COLOR);

  type = signal<SubstarateStyle>(SubstarateStyles.NONE);

  fillColors = signal<GradientColor | undefined>(DEFAULT_FILL_COLOR);

  rippleEffectColor = signal<Color | undefined>(undefined);

  pressed = signal<boolean>(false);

  focused = signal<boolean>(false);

  classes: Signal<{ [name: string]: boolean }>;

  private _themeService = inject(ThemeService);

  private _elementRef = inject(ElementRef<HTMLDivElement>);
  get element() {
    return this._elementRef.nativeElement as HTMLDivElement;
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  @HostListener('pointerup', ['$event'])
  @HostListener('pointerdown', ['$event'])
  @HostListener('click', ['$event'])
  onPointerEvent(e: MouseEvent | TouchEvent) {
    e.stopImmediatePropagation();
  }

  constructor() {
    const theme = toSignal(this._themeService.$theme);

    this.classes = computed(() => {
      const disabled = this.disabled(), pressed = this.pressed();
      return { pressed, disabled };
    });

    effect(() => {
      const disabled = this.disabled(), pressed = this.pressed(), focused = this.focused(), currentTheme = theme(),
        contentEl = this.content()?.nativeElement;
      if (contentEl && currentTheme) {
        const preset = this._themeService.getPreset(currentTheme.chat.scrollToEndButton);
        if (preset) {
          this.rippleEffectColor.set(preset.rippleColor);
          if (preset.disabled && disabled) {
            this.fillColors.set(preset.disabled.fill ?? DEFAULT_FILL_COLOR);
            contentEl.style.fill = preset.disabled.iconFill;
          } else if (focused && preset.focused) {
            this.fillColors.set(preset.focused.fill ?? DEFAULT_FILL_COLOR);
            contentEl.style.fill = preset.focused.iconFill;
          } else if (preset.pressed && pressed) {
            this.fillColors.set(preset.pressed.fill ?? DEFAULT_FILL_COLOR);
            contentEl.style.fill = preset.pressed.iconFill;
          } else {
            this.fillColors.set(preset?.normal.fill ?? DEFAULT_FILL_COLOR);
            contentEl.style.fill = preset.normal.iconFill;
          }
        }
      }
    });
  }

  click() {
    (this._elementRef.nativeElement as HTMLDivElement).click();
  }

  onClickHandler(e: Event) {
    this.onClick.emit(e);
  }

  onPressHandler(pressed: boolean) {
    this.pressed.set(pressed);
  }

  onFocusHandler(focused: boolean) {
    this.focused.set(focused);
  }
}
