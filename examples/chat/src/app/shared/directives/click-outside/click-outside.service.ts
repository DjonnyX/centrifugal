import { DestroyRef, inject, Injectable, Input, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent, of, race, Subject, switchMap, takeUntil, tap } from 'rxjs';

const DEFAULT_MAX_DISTANCE = 40;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
    providedIn: 'root'
})
export class ClickOutsideService implements OnDestroy {
    private _maxDistance = DEFAULT_MAX_DISTANCE;

    @Input('maxStaticClickDistance')
    set maxDistance(v: number | string) {
        this._maxDistance = v ? Number(v) : DEFAULT_MAX_DISTANCE;
    }

    private _$onClick = new Subject<Event>();
    $onClick = this._$onClick.asObservable();

    public activeTarget: HTMLElement | null | undefined;

    private _destroyRef = inject(DestroyRef);

    constructor() {
        const elementRef = document.body;
        const $pointerPressed = fromEvent<PointerEvent>(elementRef, 'pointerdown'),
            $pointerCancel = race([
                fromEvent(window, 'pointerup').pipe(
                    takeUntilDestroyed(),
                ),
                fromEvent<PointerEvent>(window, 'pointerleave').pipe(
                    takeUntilDestroyed(),
                ),
            ]),
            $pointerRelease = fromEvent<PointerEvent>(elementRef, 'pointerup', { passive: false });

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
                            this._$onClick.next(e);
                        }
                    }),
                );
            }),
        ).subscribe();
    }

    ngOnDestroy(): void {
        this._$onClick.complete();
        this.activeTarget = undefined;
    }
}
