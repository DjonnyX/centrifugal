import { DestroyRef, Directive, ElementRef, inject, input, Input, output } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { fromEvent, Observable, of, race, Subject, timer } from 'rxjs';
import { delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

const DEFAULT_DURATION = 3000,
    MAX_CANCEL_DIST = 20;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Directive({
    selector: '[longPress]',
})
export class LongPressDirective {
    private _duration = DEFAULT_DURATION;

    @Input('longPress')
    set duration(v: number | string) {
        this._duration = v ? Number(v) : DEFAULT_DURATION;
    }

    longPressDisabled = input<boolean>(false);

    onLongPress = output<void>();

    longPressPrevent = input<Observable<void>>(new Subject());

    onLongPressActive = output<boolean>();

    private _elementRef = inject(ElementRef<HTMLElement>);

    private _destroyRef = inject(DestroyRef);

    constructor() {
        const $disabled = toObservable(this.longPressDisabled).pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
        ),
            longPressPrevent = this.longPressPrevent().pipe(
                takeUntilDestroyed(),
            ),
            $mousePressed = fromEvent<MouseEvent>(this._elementRef.nativeElement, 'mousedown').pipe(
                takeUntilDestroyed(),
            ),
            $mouseCancel = race([
                longPressPrevent,
                fromEvent(window, 'mouseup').pipe(
                    takeUntilDestroyed(),
                ),
                fromEvent<MouseEvent>(window, 'mouseleave').pipe(
                    takeUntilDestroyed(),
                ),
            ]),
            $mouseRelease = fromEvent<MouseEvent>(this._elementRef.nativeElement, 'mouseup').pipe(
                takeUntilDestroyed(),
            ),
            $touchPressed = fromEvent<TouchEvent>(this._elementRef.nativeElement, 'touchstart').pipe(
                takeUntilDestroyed(),
            ),
            $touchCancel = race([
                longPressPrevent,
                fromEvent(window, 'touchend').pipe(
                    takeUntilDestroyed(),
                ),
                fromEvent<TouchEvent>(window, 'touchleave').pipe(
                    takeUntilDestroyed(),
                ),
            ]),
            $touchRelease = fromEvent<TouchEvent>(this._elementRef.nativeElement, 'touchend').pipe(
                takeUntilDestroyed(),
            );

        $mousePressed.pipe(
            takeUntilDestroyed(),
            switchMap(e => {
                const x = Math.abs(e.clientX),
                    y = Math.abs(e.clientY);
                return timer(this._duration).pipe(
                    takeUntilDestroyed(this._destroyRef),
                    takeUntil($disabled),
                    takeUntil($mouseCancel),
                    tap(() => {
                        this.onLongPressActive.emit(true);
                    }),
                    switchMap(() => {
                        return $mouseRelease.pipe(
                            takeUntilDestroyed(this._destroyRef),
                            takeUntil(
                                race([
                                    $disabled,
                                    $mouseCancel.pipe(
                                        takeUntilDestroyed(this._destroyRef),
                                        tap(() => {
                                            this.onLongPressActive.emit(false);
                                        }),

                                    ),
                                    fromEvent<MouseEvent>(window, 'mousemove').pipe(
                                        takeUntilDestroyed(this._destroyRef),
                                        switchMap(e => {
                                            const xx = x - Math.abs(e.clientX),
                                                yy = y - Math.abs(e.clientY),
                                                dist = Math.sqrt(Math.pow(xx, 2) + Math.pow(yy, 2));

                                            if (dist > MAX_CANCEL_DIST) {
                                                return of(true);
                                            }

                                            return of(false);
                                        }),
                                        takeUntilDestroyed(this._destroyRef),
                                        filter(v => !!v),
                                        tap(() => {
                                            this.onLongPressActive.emit(false);
                                        }),
                                    ),
                                ])
                            ),
                            delay(1),
                            takeUntilDestroyed(this._destroyRef),
                            tap(() => {
                                this.onLongPress.emit();
                            }),
                        );
                    })
                );
            }),
        ).subscribe();

        $touchPressed.pipe(
            takeUntilDestroyed(),
            switchMap(e => {
                const x = Math.abs(e.touches[e.touches.length - 1].clientX),
                    y = Math.abs(e.touches[e.touches.length - 1].clientY);
                return timer(this._duration).pipe(
                    takeUntilDestroyed(this._destroyRef),
                    takeUntil($disabled),
                    takeUntil($touchCancel),
                    tap(() => {
                        this.onLongPressActive.emit(true);
                    }),
                    switchMap(() => {
                        return $touchRelease.pipe(
                            takeUntilDestroyed(this._destroyRef),
                            takeUntil(
                                race([
                                    $disabled,
                                    $touchCancel.pipe(
                                        takeUntilDestroyed(this._destroyRef),
                                        tap(() => {
                                            this.onLongPressActive.emit(false);
                                        }),

                                    ),
                                    fromEvent<TouchEvent>(window, 'touchmove').pipe(
                                        takeUntilDestroyed(this._destroyRef),
                                        switchMap(e => {
                                            const xx = x - Math.abs(e.touches[e.touches.length - 1].clientX),
                                                yy = y - Math.abs(e.touches[e.touches.length - 1].clientY),
                                                dist = Math.sqrt(Math.pow(xx, 2) + Math.pow(yy, 2));

                                            if (dist > MAX_CANCEL_DIST) {
                                                return of(true);
                                            }

                                            return of(false);
                                        }),
                                        takeUntilDestroyed(this._destroyRef),
                                        filter(v => !!v),
                                        tap(() => {
                                            this.onLongPressActive.emit(false);
                                        }),
                                    ),
                                ])
                            ),
                            delay(1),
                            takeUntilDestroyed(this._destroyRef),
                            tap(() => {
                                this.onLongPress.emit();
                            }),
                        );
                    })
                );
            }),
        ).subscribe();
    }
}
