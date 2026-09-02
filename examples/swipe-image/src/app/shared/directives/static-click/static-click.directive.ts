import { DestroyRef, Directive, ElementRef, inject, Input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, of, race } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';

const DEFAULT_MAX_DISTANCE = 40;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Directive({
    selector: '[staticClick]',
})
export class StaticClickDirective {
    private _maxDistance = DEFAULT_MAX_DISTANCE;

    @Input('maxStaticClickDistance')
    set maxDistance(v: number | string) {
        this._maxDistance = v ? Number(v) : DEFAULT_MAX_DISTANCE;
    }

    onStaticClick = output<PointerEvent | TouchEvent>();

    private _elementRef = inject(ElementRef);
    private _destroyRef = inject(DestroyRef);

    constructor() {
        const $pointerPressed = fromEvent<PointerEvent>(this._elementRef.nativeElement, 'pointerdown'),
            $pointerCancel = race([
                fromEvent(window, 'pointerup').pipe(
                    takeUntilDestroyed(),
                ),
                fromEvent<PointerEvent>(window, 'pointerleave').pipe(
                    takeUntilDestroyed(),
                ),
            ]),
            $pointerRelease = fromEvent<PointerEvent>(this._elementRef.nativeElement, 'pointerup', { passive: false });

        $pointerPressed.pipe(
            takeUntilDestroyed(),
            switchMap(e => {
                const x = Math.abs(e.clientX),
                    y = Math.abs(e.clientY);
                return $pointerRelease.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    takeUntil(
                        race([
                            $pointerCancel,
                            fromEvent<PointerEvent>(window, 'pointermove').pipe(
                                takeUntilDestroyed(this._destroyRef),
                                switchMap(e => {
                                    const xx = x - Math.abs(e.clientX),
                                        yy = y - Math.abs(e.clientY),
                                        dist = Math.sqrt(Math.pow(xx, 2) + Math.pow(yy, 2));

                                    if (dist > this._maxDistance) {
                                        return of(true);
                                    }

                                    return of(false);
                                }),
                                takeUntilDestroyed(this._destroyRef),
                                filter(v => !!v),
                            ),
                        ]),
                    ),
                    takeUntilDestroyed(this._destroyRef),
                    tap(e => {
                        if (e) {
                            this.onStaticClick.emit(e);
                        }
                    }),
                );
            }),
        ).subscribe();
    }
}
