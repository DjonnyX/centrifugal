import { DestroyRef, Directive, effect, ElementRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { IDisplayObjectMeasures } from 'ng-virtual-list';
import { GradientColorPositions } from '@shared/types';
import { delay, tap } from 'rxjs';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Directive({
  selector: '[calcFillPositions]'
})
export class CalcFillPositionsDirective {

  measures = input<IDisplayObjectMeasures | undefined>(undefined);

  onFillPositions = output<GradientColorPositions>();

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _destroyRef = inject(DestroyRef);

  constructor() {
    const $measures = toObservable(this.measures);

    $measures.pipe(
      takeUntilDestroyed(),
      delay(0),
      takeUntilDestroyed(this._destroyRef),
      tap(() => {
        this.calculate();
      }),
    ).subscribe();

    effect(() => {
      this.calculate();
    });
  }

  private calculate() {
    const measures = this.measures();
    if (measures) {
      const { y: pos, height: size } = (this._elementRef?.nativeElement as HTMLDivElement).getBoundingClientRect(),
        { boundsSize } = measures,
        absoluteStartPosition = pos, ratio = size !== 0 ? boundsSize / size : 0,
        absoluteStartPositionPercent = -(boundsSize !== 0 ? absoluteStartPosition / boundsSize : 0) * ratio,
        absoluteEndPosition = boundsSize - (absoluteStartPositionPercent + size),
        absoluteEndPositionPercent = (absoluteStartPositionPercent + (boundsSize !== 0 ? (absoluteEndPosition + size) / boundsSize : 0) * ratio);
      this.onFillPositions.emit([absoluteStartPositionPercent, absoluteEndPositionPercent]);
    }
  }
}
