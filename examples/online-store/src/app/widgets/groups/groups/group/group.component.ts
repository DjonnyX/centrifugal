import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, ElementRef, inject, input, output, Signal, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, tap } from 'rxjs';
import { IDisplayObjectConfig, IVirtualListItem } from 'centrifugal';
import { StaticClickDirective } from '@shared/directives';
import { LocaleSensitiveDirective } from '@shared/localization';
import { ITheme, ThemeService } from '@shared/theming';
import { Color } from '@shared/types';
import { IStoreItemData } from '@shared/models/message';
import { NtListPublicService } from 'centrifugal';

const DEFAULT_MAX_DISTANCE = 40,
  POINTER_ENTER = 'pointerenter',
  POINTER_LEAVE = 'pointerleave',
  DEFAULT_BACKGROUND_COLOR = '#ffffff';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-group',
  imports: [
    CommonModule, StaticClickDirective, LocaleSensitiveDirective,
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent {
  hover = signal<boolean>(false);

  backgroundColor = signal<Color>(DEFAULT_BACKGROUND_COLOR);

  color = signal<Color>(DEFAULT_BACKGROUND_COLOR);

  fill = signal<Color>(DEFAULT_BACKGROUND_COLOR);

  theme: Signal<ITheme | undefined>;

  api = input<NtListPublicService>();

  data = input<IVirtualListItem<IStoreItemData> | null>();

  config = input<IDisplayObjectConfig | null>();

  staticClick = output<IVirtualListItem<any>>();

  readonly maxStaticClickDistance = DEFAULT_MAX_DISTANCE;

  private _themeService = inject(ThemeService);

  private _elementRef = inject(ElementRef);

  private _destroyRef = inject(DestroyRef);

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

    fromEvent(this._elementRef.nativeElement, POINTER_ENTER).pipe(
      takeUntilDestroyed(this._destroyRef),
      tap(() => {
        this.hover.set(true);
      }),
    ).subscribe();

    fromEvent(this._elementRef.nativeElement, POINTER_LEAVE).pipe(
      takeUntilDestroyed(this._destroyRef),
      tap(() => {
        this.hover.set(false);
      }),
    ).subscribe();

    effect(() => {
      const theme = this.theme();
      if (!!theme) {
        const preset = this._themeService.getPreset(theme.onlineStore.groups.group);
        if (!!preset) {
          const selected = this.config()?.selected, hover = this.hover();
          if (selected && hover) {
            this.backgroundColor.set(preset.selectedFocused.fill);
            this.color.set(preset.selectedFocused.color);
            this.fill.set(preset.selectedFocused.iconColor);
          } else if (hover) {
            this.backgroundColor.set(preset.focused.fill);
            this.color.set(preset.focused.color);
            this.fill.set(preset.focused.iconColor);
          } else if (selected) {
            this.backgroundColor.set(preset.selected.fill);
            this.color.set(preset.selected.color);
            this.fill.set(preset.selected.iconColor);
          } else {
            this.backgroundColor.set(preset.normal.fill);
            this.color.set(preset.normal.color);
            this.fill.set(preset.normal.iconColor);
          }
        }
      }
    });
  }

  onGroupClickHandler(item: IVirtualListItem<any>) {
    this.staticClick.emit(item);
  }

  onClickHandler(e: Event) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}
