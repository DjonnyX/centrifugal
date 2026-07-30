import { Directive, ElementRef, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { TextDirection } from '../../types';
import { TextDirections } from '../../enums';

const LEFT = 'left',
  RIGHT = 'right',
  DIR = 'dir';

/**
 * LocaleSensitiveDirective
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/directives/nt-locale-sensitive/nt-locale-sensitive.directive.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Directive({
  selector: '[localeSensitive]',
  standalone: false,
})
export class NtLocaleSensitiveDirective {
  protected _langTextDirTransform = {
    transform: (v: TextDirection) => {
      const valid = v === TextDirections.LTR || v === TextDirections.RTL;
      if (!valid) {
        console.error('The "langTextDir" parameter must be one of type `ltr` or `rtl`.');
        return TextDirections.LTR;
      }
      return v;
    },
  } as any;

  langTextDir = input<TextDirection>(TextDirections.LTR, { ...this._langTextDirTransform });

  private _elementRef = inject(ElementRef<HTMLElement>);

  constructor() {
    const $langTextDir = toObservable(this.langTextDir);
    $langTextDir.pipe(
      takeUntilDestroyed(),
      tap(dir => {
        const element = this._elementRef.nativeElement as HTMLElement;
        element.setAttribute(DIR, dir);
        if (dir === TextDirections.RTL) {
          element.style.textAlign = RIGHT;
          element.classList.add(TextDirections.RTL);
          element.classList.remove(TextDirections.LTR);
        } else {
          element.style.textAlign = LEFT;
          element.classList.add(TextDirections.LTR);
          element.classList.remove(TextDirections.RTL);
        }
      }),
    ).subscribe();
  }
}
