import { Directive, ElementRef, inject } from '@angular/core';
import { LocalizationService } from './localization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { TextDirections } from './localizations/enums';

/**
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Directive({
  selector: '[localeSensitive]'
})
export class LocaleSensitiveDirective {
  private _localizationService = inject(LocalizationService);

  private _elementRef = inject(ElementRef<HTMLElement>);

  constructor() {
    this._localizationService.$locale.pipe(
      takeUntilDestroyed(),
      tap(() => {
        const dir = this._localizationService.textDirection,
          element = this._elementRef.nativeElement as HTMLElement;
        element.setAttribute('dir', dir);
        if (dir === TextDirections.RTL) {
          element.style.textAlign = 'right';
          element.classList.add(TextDirections.RTL);
          element.classList.remove(TextDirections.LTR);
        } else {
          element.classList.add(TextDirections.LTR);
          element.classList.remove(TextDirections.RTL);
        }
      }),
    ).subscribe();
  }
}
