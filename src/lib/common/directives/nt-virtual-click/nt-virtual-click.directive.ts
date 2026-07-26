import { DestroyRef, Directive, ElementRef, inject, Input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, fromEvent, of, race } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DEFAULT_CLICK_DISTANCE } from '../../../list/const';
import { SCROLL_VIEW_SERVICE } from '../../injection';

/**
 * VirtualClickDirective
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/directives/nt-item-click/nt-item-click.directive.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Directive({
    selector: '[virtualClick]',
    standalone: false,
})
export class NtVirtualClickDirective {
    private _$maxDistance = new BehaviorSubject<number | null>(null);
    protected $maxDistance = this._$maxDistance.asObservable();

    private _maxDistance: number | null = null;

    @Input('maxClickDistance')
    set maxDistance(v: number | string) {
        const value = (v !== null || v !== undefined) ? Number(v) : null;
        this._maxDistance = value;
        this._$maxDistance.next(value);
    }

    private _emitNativeClick: boolean = true;

    @Input('emitNativeClick')
    set emitNativeClick(v: boolean) {
        if (this._emitNativeClick !== v) {
            this._emitNativeClick = v;
        }
    }

    onVirtualClick = output<PointerEvent | TouchEvent>();

    onVirtualClickPress = output<PointerEvent | TouchEvent>();

    onVirtualClickCancel = output<void>();

    private _service = inject(SCROLL_VIEW_SERVICE);

    private _elementRef = inject(ElementRef);

    private _destroyRef = inject(DestroyRef);

    constructor() {
        let maxDistance = this._maxDistance ?? DEFAULT_CLICK_DISTANCE;
        combineLatest([this._service.$clickDistance, this.$maxDistance]).pipe(
            takeUntilDestroyed(),
            tap(([clickDistance, distance]) => {
                maxDistance = distance === null ? clickDistance : distance;
            }),
        ).subscribe();

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
                this.onVirtualClickPress.emit(e);
                return $pointerRelease.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    takeUntil(
                        race([
                            $pointerCancel.pipe(
                                takeUntilDestroyed(this._destroyRef),
                                tap(() => {
                                    this.onVirtualClickCancel.emit();
                                }),
                            ),
                            fromEvent<PointerEvent>(window, 'pointermove').pipe(
                                takeUntilDestroyed(this._destroyRef),
                                switchMap(e => {
                                    const xx = x - Math.abs(e.clientX),
                                        yy = y - Math.abs(e.clientY),
                                        dist = Math.sqrt(Math.pow(xx, 2) + Math.pow(yy, 2));

                                    if (dist > maxDistance) {
                                        this.onVirtualClickCancel.emit();
                                        return of(true);
                                    }

                                    return of(false);
                                }),
                                filter(v => !!v),
                            ),
                        ]),
                    ),
                    takeUntilDestroyed(this._destroyRef),
                    tap(e => {
                        if (!!e) {
                            this.onVirtualClick.emit(e);

                            if (this._emitNativeClick) {
                                const target = e.target as HTMLElement;
                                if (target.click instanceof Function) {
                                    target.click();
                                }
                            }
                        }
                    }),
                );
            }),
        ).subscribe();
    }
}
