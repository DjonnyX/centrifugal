import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, effect, ElementRef, inject, input, OnDestroy, output, Signal, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { delay, Subject, tap } from 'rxjs';
import { ButtonComponent } from '@shared/components/button';
import { SubstarateStyle, SubstarateStyles } from '@shared/components/substrate';
import { Color, GradientColor, GradientColorPositions } from '@shared/types';
import { ThemeService } from '@shared/theming';
import { MessageButtonSendState } from './types';
import { MessageButtonSendStates } from './enums';

const DEFAULT_STROKE_COLOR: GradientColor = ['rgba(186, 250, 255, 0)', 'rgb(183, 235, 255)'],
  DEFAULT_FILL_COLOR: GradientColor = ['rgb(255, 255, 255)', 'rgb(185, 210, 233)'];

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-message-send-button',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './message-send-button.component.html',
  styleUrl: './message-send-button.component.scss'
})
export class MessageSendButtonComponent implements OnDestroy {
  content = viewChild<ElementRef<HTMLDivElement>>('content');

  onClick = output<Event>();

  loading = input<boolean>(false);

  valid = input<boolean>(false);

  state = input<MessageButtonSendState>(MessageButtonSendStates.CANCEL);

  fillPositions = input<GradientColorPositions>();

  buttonStrokeColor = signal<GradientColor>(DEFAULT_STROKE_COLOR);

  fillColors = signal<GradientColor | undefined>(DEFAULT_FILL_COLOR);

  rippleEffectColor = signal<Color | undefined>(undefined);

  pressed = signal<boolean>(false);

  focused = signal<boolean>(false);

  type: Signal<SubstarateStyle>;

  disabled: Signal<boolean>;

  classes: Signal<{ [name: string]: boolean }>;

  private _$pressed = new Subject<boolean>();
  protected $pressed = this._$pressed.asObservable();

  private _$click = new Subject<Event>();
  protected $click = this._$click.asObservable();

  private _themeService = inject(ThemeService);

  private _destroyRef = inject(DestroyRef);

  constructor() {
    const $pressed = this.$pressed;

    $pressed.pipe(
      takeUntilDestroyed(),
      delay(300),
      takeUntilDestroyed(this._destroyRef),
      tap(v => {
        this.pressed.set(v);
      }),
    ).subscribe();

    const $click = this.$click;

    $click.pipe(
      takeUntilDestroyed(),
      delay(300),
      takeUntilDestroyed(this._destroyRef),
      tap(v => {
        this.onClick.emit(v);
      }),
    ).subscribe();

    const theme = toSignal(this._themeService.$theme);

    this.type = computed(() => {
      const loading = this.loading();
      return loading ? SubstarateStyles.STROKE : SubstarateStyles.NONE;
    });

    this.classes = computed(() => {
      const state = this.state(), disabled = this.disabled(), pressed = this.pressed();
      return { [state]: true, pressed, disabled };
    });

    this.disabled = computed(() => {
      const state = this.state(), valid = this.valid(), loading = this.loading();
      return (state === MessageButtonSendStates.SEND) && (!valid || loading);
    });

    effect(() => {
      const disabled = this.disabled(), pressed = this.pressed(), focused = this.focused(), state = this.state(), currentTheme = theme(),
        contentEl = this.content()?.nativeElement;
      if (contentEl && currentTheme) {
        let preset: any | undefined;
        switch (state) {
          case MessageButtonSendStates.SEND: {
            preset = this._themeService.getPreset(currentTheme.chat.messageCreator.controls.send);
            break;
          }
          case MessageButtonSendStates.CANCEL: {
            preset = this._themeService.getPreset(currentTheme.chat.messageCreator.controls.cancel);
            break;
          }
        }
        if (preset) {
          this.rippleEffectColor.set(preset.rippleColor);
          if (preset.disabled && disabled) {
            this.fillColors.set(preset.disabled.fill ?? DEFAULT_FILL_COLOR);
            if (preset.disabled.strokeGradientColor) {
              this.buttonStrokeColor.set(preset.disabled.strokeGradientColor);
            }
            contentEl.style.fill = preset.disabled.iconFill;
          } else if (focused && preset.focused) {
            this.fillColors.set(preset.focused.fill ?? DEFAULT_FILL_COLOR);
            if (preset.focused.strokeGradientColor) {
              this.buttonStrokeColor.set(preset.focused.strokeGradientColor);
            }
            contentEl.style.fill = preset.focused.iconFill;
          } else if (preset.pressed && pressed) {
            this.fillColors.set(preset.pressed.fill ?? DEFAULT_FILL_COLOR);
            if (preset.pressed.strokeGradientColor) {
              this.buttonStrokeColor.set(preset.pressed.strokeGradientColor);
            }
            contentEl.style.fill = preset.pressed.iconFill;
          } else {
            this.fillColors.set(preset.normal.fill ?? DEFAULT_FILL_COLOR);
            if (preset.normal.strokeGradientColor) {
              this.buttonStrokeColor.set(preset.normal.strokeGradientColor);
            }
            contentEl.style.fill = preset.normal.iconFill;
          }
        }
      }
    });
  }

  onClickHandler(e: Event) {
    this._$click.next(e);
  }

  onPressHandler(pressed: boolean) {
    this._$pressed.next(pressed);
  }

  onFocusHandler(focused: boolean) {
    this.focused.set(focused);
  }

  ngOnDestroy(): void {
    this._$pressed.complete();
    this._$click.complete();
  }
}
