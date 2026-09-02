import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, input, output, Signal, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '@shared/components/button';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { GradientColor, GradientColorPositions } from '@shared/types';

const CLASS_ACTIVE = 'active';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-menu-button',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.scss'
})
export class MenuButtonComponent {
  content = viewChild<ElementRef<HTMLDivElement>>('content');

  name = input<string | undefined>(undefined);

  opened = input<boolean>(false);

  onClick = output<Event>();

  pressed = signal<boolean>(false);

  focused = signal<boolean>(false);

  theme: Signal<ITheme | undefined>;

  private _themeService = inject(ThemeService);

  iconNormalFill = signal<string>('inherit');

  iconPressedFill = signal<string>('inherit');

  iconFocusedFill = signal<string>('inherit');

  fillColors = signal<GradientColor | undefined>(undefined);

  fillPositions = signal<GradientColorPositions>([0, 1]);

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

    effect(() => {
      const theme = this.theme(), pressed = this.pressed(), focused = this.focused(), contentElement = this.content()?.nativeElement;
      if (theme && contentElement) {
        const preset = this._themeService.getPreset(theme.chat.header.menuButton);
        if (preset) {
          if (focused) {
            this.fillColors.set(preset.focused.fill);
            contentElement.style.color = preset.focused.color;
            this.iconFocusedFill.set(preset.focused.iconFill);
          } else if (pressed) {
            this.fillColors.set(preset.pressed.fill);
            contentElement.style.color = preset.pressed.color;
            this.iconPressedFill.set(preset.pressed.iconFill);
          } else {
            this.fillColors.set(preset.normal.fill);
            contentElement.style.color = preset.normal.color;
            this.iconNormalFill.set(preset.normal.iconFill);
          }
        }
      }

    });

    effect(() => {
      const opened = this.opened(), contentElement = this.content()?.nativeElement;
      if (contentElement) {
        if (opened) {
          contentElement.classList.add(CLASS_ACTIVE);
        } else {
          contentElement.classList.remove(CLASS_ACTIVE);
        }
      }
    });
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
