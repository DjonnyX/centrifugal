import { DestroyRef, Directive, ElementRef, inject, Input, input, OnInit, output, SecurityContext } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, fromEvent, of, race, timer } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CONTROL_CONTAINER_SERVICE, SCROLL_VIEW_SERVICE } from '../../injection';
import { toggleClassName, validateBoolean, validateFloat } from '../../utils';
import { ANCHOR, DEFAULT_CLICK_DISTANCE, DEFAULT_DURATION, INPUT } from './const';
import { CLICK, FOCUS, POINTER_DOWN, POINTER_LEAVE, POINTER_MOVE, POINTER_UP } from '../../const/event-names';
import { INtBaseControlContainerService } from '../../interfaces';
import { GRABBING, NOT_GRABBING } from '../../const/class-names';
import { DomSanitizer } from '@angular/platform-browser';
import { INtBaseScrollViewService } from '../../interfaces/nt-base-scroll-view-service';
import { ATTR_TYPE, NT_SERVICE_ID } from '../../const/attribute-names';
import { NT_VALUE } from '../../../control-container/const';
import { PATTERN_DOT } from '../../const/pattern';
import { isInteractive } from '../../utils/is-interactive';

/**
 * NtControlDirective
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/directives/nt-control/nt-control.directive.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Directive({
    selector: '[ntControl]',
    standalone: false,
})
export class NtControlDirective<S extends INtBaseScrollViewService, C extends INtBaseControlContainerService> implements OnInit {
    protected _service = inject<S>(SCROLL_VIEW_SERVICE);

    protected _controlService = inject<C>(CONTROL_CONTAINER_SERVICE);

    onLongPress = output<void>();

    private _$duration = new BehaviorSubject<number>(DEFAULT_DURATION);
    readonly $duration = this._$duration.asObservable();
    get duration() { return this._$duration.getValue(); }

    protected _durationTransform = {
        transform: (v: number) => {
            const valid = validateFloat(v);
            if (!valid) {
                console.error('The "longPress" parameter must be of type `number`.');
                return DEFAULT_DURATION;
            }
            return v;
        },
    } as any;

    @Input('longPress')
    set duration(v: number) {
        const value = this._durationTransform.transform(v);
        if (this.duration !== v) {
            this._$duration.next(value);
        }
    }

    protected _longPressEnableTransform = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);
            if (!valid) {
                console.error('The "longPressEnable" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    longPressEnable = input<boolean>(false, { ...this._longPressEnableTransform });

    protected _maxClickDistanceTransform = {
        transform: (v: number) => {
            const valid = validateFloat(v);
            if (!valid) {
                console.error('The "maxClickDistance" parameter must be of type `number`.');
                return DEFAULT_CLICK_DISTANCE;
            }
            return v;
        },
    } as any;

    maxClickDistance = input<number>(DEFAULT_CLICK_DISTANCE, { ...this._maxClickDistanceTransform });

    protected _emitNativeClickTransform = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);
            if (!valid) {
                console.error('The "emitNativeClick" parameter must be of type `boolean`.');
                return true;
            }
            return v;
        },
    } as any;

    emitNativeClick = input<boolean>(true, { ...this._emitNativeClickTransform });

    protected _focusElementTransform = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);
            if (!valid) {
                console.error('The "focusElement" parameter must be of type `boolean`.');
                return true;
            }
            return v;
        },
    } as any;

    focusElement = input<boolean>(true, { ...this._focusElementTransform });

    protected _allowedAnchorDraggableTransform = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);
            if (!valid) {
                console.error('The "allowedAnchorDraggable" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether anchors can be moved by dragging. Default value is `false`.
     */
    allowedAnchorDraggable = input<boolean>(false, { ...this._allowedAnchorDraggableTransform });

    onVirtualClick = output<PointerEvent | TouchEvent>();

    onVirtualClickPress = output<PointerEvent | TouchEvent>();

    onVirtualClickCancel = output<void>();

    private _$elementTarget = new BehaviorSubject<HTMLElement | null>(null);
    protected $elementTarget = this._$elementTarget.asObservable();

    private _$timer = new BehaviorSubject<number>(0);
    protected $timer = this._$timer.asObservable();

    private _$timerComplited = new BehaviorSubject<boolean>(false);
    protected $timerComplited = this._$timerComplited.asObservable();

    private _ngControl = inject(NgControl, { self: true, optional: true });

    private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    private _sanitizer = inject(DomSanitizer);

    private _destroyRef = inject(DestroyRef);

    constructor() {
        const root = this._controlService?.emitter ?? window,
            host = this._elementRef.nativeElement,
            targetTagName = host.tagName.toLowerCase();

        host.setAttribute(NT_SERVICE_ID, this._service.id.toString());

        this._controlService.$keyboardEnabled.pipe(
            takeUntilDestroyed(),
            switchMap(keyboardEnabled => {
                return fromEvent(this._elementRef.nativeElement, FOCUS).pipe(
                    takeUntilDestroyed(this._destroyRef),
                    map(e => e.target as HTMLElement),
                    filter(target => !!target),
                    distinctUntilChanged(),
                    tap(target => {
                        this._controlService.focusEcho(target, this._ngControl, this._service.id);
                        if (keyboardEnabled) {
                            if (isInteractive(targetTagName) && target.blur instanceof Function) {
                                target.blur();
                            }
                        } else if (!keyboardEnabled && target.focus instanceof Function) {
                            target.focus({ preventScroll: true });
                        }
                    }),
                );
            })
        ).subscribe();

        const $allowedAnchorDraggable = toObservable(this.allowedAnchorDraggable);
        $allowedAnchorDraggable.pipe(
            takeUntilDestroyed(),
            tap(v => {
                if (targetTagName === ANCHOR) {
                    const aTarget = host as HTMLAnchorElement;
                    aTarget.draggable = v;
                }
            }),
        ).subscribe();

        let maxDistance = this.maxClickDistance() ?? DEFAULT_CLICK_DISTANCE;

        const $maxDistance = toObservable(this.maxClickDistance);

        if (!!this._service) {
            combineLatest([this._service.$grabbing, this.$elementTarget]).pipe(
                takeUntilDestroyed(),
                tap(([v, t]) => {
                    if (!!t) {
                        toggleClassName(t, v ? GRABBING : NOT_GRABBING, [v ? NOT_GRABBING : GRABBING]);
                    }
                }),
            ).subscribe();

            combineLatest([this._service.$clickDistance, $maxDistance]).pipe(
                takeUntilDestroyed(),
                tap(([clickDistance, distance]) => {
                    maxDistance = distance === null ? clickDistance : distance;
                }),
            ).subscribe();
        } else {
            $maxDistance.pipe(
                takeUntilDestroyed(),
                tap(distance => {
                    maxDistance = distance === null ? DEFAULT_CLICK_DISTANCE : distance;
                }),
            ).subscribe();
        }

        const $pointerPressed = fromEvent<PointerEvent>(host, POINTER_DOWN),
            $pointerCancel = race([
                fromEvent(root, POINTER_UP).pipe(
                    takeUntilDestroyed(),
                ),
                fromEvent<PointerEvent>(root, POINTER_LEAVE).pipe(
                    takeUntilDestroyed(),
                ),
            ]),
            $pointerRelease = fromEvent<PointerEvent>(host, POINTER_UP, { passive: false });

        const $timer = this.$timer;
        $timer.pipe(
            takeUntilDestroyed(),
            filter(v => v > 0),
            switchMap(v => {
                return timer(v);
            }),
            tap(() => {
                this._$timerComplited.next(true);
            }),
        ).subscribe();

        $pointerPressed.pipe(
            takeUntilDestroyed(),
            switchMap(e => {
                this._$elementTarget.next(e.target as HTMLElement);
                const x = Math.abs(e.clientX),
                    y = Math.abs(e.clientY);
                this.onVirtualClickPress.emit(e);
                if (this.longPressEnable()) {
                    this._$timerComplited.next(false);
                    this._$timer.next(this.duration);
                }
                return $pointerRelease.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    takeUntil(
                        race([
                            $pointerCancel.pipe(
                                takeUntilDestroyed(this._destroyRef),
                                tap(() => {
                                    if (this.longPressEnable()) {
                                        this._$timer.next(0);
                                    }
                                    this.onVirtualClickCancel.emit();
                                    this._$elementTarget.next(null);
                                }),
                            ),
                            fromEvent<PointerEvent>(root, POINTER_MOVE).pipe(
                                takeUntilDestroyed(this._destroyRef),
                                switchMap(e => {
                                    const xx = x - Math.abs(e.clientX),
                                        yy = y - Math.abs(e.clientY),
                                        dist = Math.sqrt(Math.pow(xx, 2) + Math.pow(yy, 2));

                                    if (dist > maxDistance) {
                                        if (this.longPressEnable()) {
                                            this._$timer.next(0);
                                        }
                                        this.onVirtualClickCancel.emit();
                                        return of(true);
                                    }

                                    return of(false);
                                }),
                                filter(v => !!v),
                            ),
                        ]),
                    ),
                );
            }),
            takeUntilDestroyed(this._destroyRef),
            tap(e => {
                if (!!e) {
                    if (!!this._controlService && e.cancelable) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }

                    if (!!this.longPressEnable() && this._$timerComplited.getValue()) {
                        this.onLongPress.emit();
                    } else {
                        this.onVirtualClick.emit(e);
                    }
                    this._$timer.next(0);

                    if (this.emitNativeClick()) {
                        const target = e.target as HTMLElement,
                            targetTagName = target.tagName.toLowerCase();
                        if (!!targetTagName) {
                            if (targetTagName === ANCHOR) {
                                const aTarget = target as HTMLAnchorElement,
                                    url = String(aTarget.href),
                                    sanitizedUrl = this._sanitizer.sanitize(SecurityContext.URL, url);
                                if (sanitizedUrl !== null) {
                                    window.open(sanitizedUrl, aTarget.target);
                                }
                            } else {
                                if (this.focusElement() && !!this._controlService) {
                                    this._controlService.focusEcho(target, this._ngControl, this._service.id);
                                }
                            }
                        }
                    }
                }
                this._$elementTarget.next(null);
            }),
        ).subscribe();

        if (!!this._controlService) {
            fromEvent<PointerEvent>(host, CLICK, { passive: false }).pipe(
                takeUntilDestroyed(),
                tap(e => {
                    e.preventDefault();
                }),
            ).subscribe();
        }
    }

    ngOnInit(): void {
        this._ngControl?.valueChanges?.pipe(
            takeUntilDestroyed(this._destroyRef),
            tap(v => {
                const target = this._elementRef.nativeElement,
                    targetTagName = target.tagName.toLowerCase();
                if (!(this._controlService.input === PATTERN_DOT && targetTagName === INPUT && target.getAttribute(ATTR_TYPE))) {
                    this._elementRef.nativeElement.setAttribute(NT_VALUE, v ?? '');
                }
            }),
        ).subscribe();
    }
}
