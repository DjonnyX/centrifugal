import {
    Component, computed, inject, Injector, input, Signal, ViewChild,
} from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
    BehaviorSubject, combineLatest, debounceTime, delay, filter, fromEvent, map, of, race, skipWhile, startWith, Subject, switchMap, takeUntil, tap,
} from 'rxjs';
import { ANIMATOR_MIN_TIMESTAMP, Animator, Easing, easeOutQuad } from '../../../common/utils/animator';
import {
    DEFAULT_ANIMATION_PARAMS, DEFAULT_SCROLLING_ONE_BY_ONE, DEFAULT_SNAP_TO_ITEM, DEFAULT_SNAP_TO_ITEM_ALIGN, DEFAULT_SNAPPING_DISTANCE,
    EXCLUDED_CONTAINERS,
} from './const';
import {
    ACCELERATION_SCALE, ANIMATION_DURATION, DURATION, FRICTION_FORCE, MASS, MAX_DIST, MAX_DURATION, MAX_ITERATIONS_FOR_AVERAGE_CALCULATIONS,
    MAX_VELOCITY_TIMESTAMP, MAX_VELOCITIES_LENGTH, OVERSCROLL_START_ITERATION, SPEED_SCALE, MIN_ACCELERATION, MIN_DELTA,
    OVERSCROLL_EFFECT_TIME,
} from './const';
import { calculateDirection, matrix3d } from './utils';
import { NtDBaseScrollView } from './base';
import { INtDScrollViewScrollingSettings } from './interfaces';
import { INtDScrollViewAnimationParams } from './interfaces';
import { calculateVelocity } from './utils/calculate-velocity';
import {
    Directions, Id, IPoint, ISize, SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO, SCROLL_VIEW_USER_INTERACTION_ENABLED, ScrollDirection, SnappingDistance,
    SnapToItemAlign, SnapToItemAligns, TextDirections,
} from '../../../common';
import { MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, TOUCH_END, TOUCH_MOVE, TOUCH_START, WHEEL, } from '../../../common/const/event-names';
import { INTERACTIVE } from '../../../common/const/class-names';
import { IScrollToParams } from '../../../common/interfaces/scroll-to-params';
import { IWheelEvent } from '../../../common/interfaces/wheel-event';
import { getScrollable } from '../../../common/utils/get-scrollable';
import { LEFT_PROP_NAME, TOP_PROP_NAME, X_PROP_NAME, Y_PROP_NAME } from '../../../common/const/base-prop-names';
import { ScrollerTypes } from '../../../common/enums/scroller-types';
import { ICancelOverscrollOptions } from '../../../common/interfaces/cancel-overscroll-options';
import { IAnimatorUpdateData } from '../../../common/utils/animator/interfaces';
import { OverscrollEvent } from '../../../common/events/overscroll-event';
import { transitionExponent } from '../../../common/utils/transitions';
import { DEFAULT_TRANSITION_EXPONENT } from '../../../common/const/transitions';
import { BEHAVIOR_AUTO, BEHAVIOR_INSTANT, BEHAVIOR_SMOOTH } from '../../../common/const/behavior';
import { DEFAULT_OVERSCROLL_ENABLED, DEFAULT_SCROLL_BEHAVIOR, DEFAULT_SCROLLABLE, DEFAULT_SCROLLING_SETTINGS } from '../../../common/const/scroller';
import { SCROLL_EVENT } from '../../const/index';
import { isPercentageValue, parseFloatOrPersentageValue } from '../../../common/utils';
import { isTouchSupported } from '../../../common/utils/is-touch-supported';

/**
 * NtDScrollView
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/core/nt-d-scroller/nt-d-scroll-view/nt-d-scroll-view.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-d-scroll-view',
    template: '',
})
export class NtDScrollView extends NtDBaseScrollView {
    @ViewChild('scrollViewport', { read: CdkScrollable })
    readonly cdkScrollable: CdkScrollable | undefined;

    readonly scrollable = input<boolean>(DEFAULT_SCROLLABLE);

    readonly scrollBehavior = input<ScrollBehavior>(DEFAULT_SCROLL_BEHAVIOR);

    readonly overscrollEnabled = input<boolean>(DEFAULT_OVERSCROLL_ENABLED);

    readonly scrollingSettings = input<INtDScrollViewScrollingSettings>(DEFAULT_SCROLLING_SETTINGS);

    readonly animationParams = input<INtDScrollViewAnimationParams>(DEFAULT_ANIMATION_PARAMS);

    readonly snapToItem = input<boolean>(DEFAULT_SNAP_TO_ITEM);

    readonly scrollingOneByOne = input<boolean>(DEFAULT_SCROLLING_ONE_BY_ONE);

    readonly snapToItemAlign = input<SnapToItemAlign>(DEFAULT_SNAP_TO_ITEM_ALIGN);

    readonly snappingDistance = input<SnappingDistance>(DEFAULT_SNAPPING_DISTANCE);

    protected _normalizeValueFromZero = inject(SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO);

    protected _userInteraction = inject(SCROLL_VIEW_USER_INTERACTION_ENABLED);

    protected _isScrollsTo: boolean = false;

    private _scrollDirectionValueX: number = 0;

    private _scrollDirectionValueY: number = 0;

    private _dragX: number = 0;

    private _dragY: number = 0;

    private _$scrollDirectionX = new BehaviorSubject<ScrollDirection>(0);
    readonly $scrollDirectionX = this._$scrollDirectionX.asObservable();
    set scrollDirectionX(v: ScrollDirection) {
        if (this.scrollDirectionX !== v) {
            this._$scrollDirectionX.next(v);
        }
    }
    get scrollDirectionX() {
        return this._$scrollDirectionX.getValue();
    }

    private _$scrollDirectionY = new BehaviorSubject<ScrollDirection>(0);
    readonly $scrollDirectionY = this._$scrollDirectionY.asObservable();
    set scrollDirectionY(v: ScrollDirection) {
        if (this.scrollDirectionY !== v) {
            this._$scrollDirectionY.next(v);
        }
    }
    get scrollDirectionY() {
        return this._$scrollDirectionY.getValue();
    }

    protected _$wheel = new Subject<IWheelEvent>();
    readonly $wheel = this._$wheel.asObservable();

    protected _$scroll = new Subject<boolean>();
    readonly $scroll = this._$scroll.asObservable();

    protected _$scrollEnd = new Subject<boolean>();
    readonly $scrollEnd = this._$scrollEnd.asObservable();

    protected _velocitiesX: Array<number> = [];

    protected _velocitiesY: Array<number> = [];

    protected _$velocityX = new BehaviorSubject<number>(0);
    protected $velocityX = this._$velocityX.asObservable();
    get velocityX() { return this._$velocityX.getValue(); }

    protected _$velocityY = new BehaviorSubject<number>(0);
    protected $velocityY = this._$velocityY.asObservable();
    get velocityY() { return this._$velocityY.getValue(); }

    protected _$averageVelocityX = new BehaviorSubject<number>(0);
    protected $averageVelocityX = this._$averageVelocityX.asObservable();
    get averageVelocityX() { return this._$averageVelocityX.getValue(); }

    protected _$averageVelocityY = new BehaviorSubject<number>(0);
    protected $averageVelocityY = this._$averageVelocityY.asObservable();
    get averageVelocityY() { return this._$averageVelocityY.getValue(); }

    private _measureVelocityTimestampX: number = Date.now();

    private _measureVelocityTimestampY: number = Date.now();

    private _measureVelocityLastPositionX: number = this._x;

    private _measureVelocityLastPositionY: number = this._y;

    private _startPositionX = 0;

    private _startPositionY = 0;

    private _touchId = -1;

    protected _animatorX = new Animator();

    protected _animatorY = new Animator();

    protected _interactive = true;

    private _overscrollXIteration = 0;

    private _overscrollYIteration = 0;

    private _userScrollDirectionIsHorizontal: boolean = false;

    private _overscrollIteration: number = 0;

    override set x(v: number) {
        this.setX(v);
    }
    override get x() { return this._x; }

    protected setX(x: number, snap: boolean = true, normalize: boolean = true) {
        if (x !== undefined && !Number.isNaN(x)) {
            this._x = this._actualY = x;

            if (normalize) {
                this.normalizeScrollSize();
            }

            this.updateDirectionX(x, this._x);

            this.refreshCoordinate(this._x, this._y);

            this.measureVelocity();

            if (snap) {
                this.checkIntersectionComponent();
            }
        }
    }

    override set y(v: number) {
        this.setY(v);
    }
    override get y() { return this._y; }

    protected setY(y: number, snap: boolean = true, normalize: boolean = true) {
        if (y !== undefined && !Number.isNaN(y)) {
            this._y = this._actualY = y;

            if (normalize) {
                this.normalizeScrollSize();
            }

            this.updateDirectionY(y, this._y);

            this.refreshCoordinate(this._x, this._y);

            this.measureVelocity();

            if (snap) {
                this.checkIntersectionComponent();
            }
        }
    }

    protected _deltaX: number = 0;
    set deltaX(v: number) {
        this._deltaX = v;
        this._startPositionX += v;
    }

    protected _deltaY: number = 0;
    set deltaY(v: number) {
        this._deltaY = v;
        this._startPositionY += v;
    }

    override set startLayoutOffsetX(v: number) {
        if (this._startLayoutOffsetX !== v) {
            this._startLayoutOffsetX = v;

            this.refreshCoordinate(this._x, this._y);
        }
    }
    override get startLayoutOffsetX() { return this._startLayoutOffsetX; }

    override set startLayoutOffsetY(v: number) {
        if (this._startLayoutOffsetY !== v) {
            this._startLayoutOffsetY = v;

            this.refreshCoordinate(this._x, this._y);
        }
    }
    override get startLayoutOffsetY() { return this._startLayoutOffsetY; }

    protected _intersectionComponentId: Id | null = null;

    protected _isAlignmentAnimation = false;

    get animatedX() { return this._animatorX?.isAnimated ?? false; }

    get animatedY() { return this._animatorY?.isAnimated ?? false; }

    get animated() { return this.animatedX || this.animatedY; }

    protected _horizontalAxisInvertion: Signal<boolean>;

    protected _horizontalAxisEnabled: Signal<boolean>;

    protected _verticalAxisEnabled: Signal<boolean>;

    protected _horizontalAxleLock: boolean = false;

    protected _verticalAxleLock: boolean = false;

    protected _horizontalScrollRatio = 0;
    get horizontalScrollRatio() { return this._horizontalScrollRatio; }

    protected _verticalScrollRatio = 0;
    get verticalScrollRatio() { return this._verticalScrollRatio; }

    protected _injector = inject(Injector);

    constructor() {
        super();

        this._isContainerAllowedForCorrection = EXCLUDED_CONTAINERS.indexOf(this._type as ScrollerTypes) === -1;

        let mouseCanceled = false,
            touchCanceled = false;

        this._horizontalAxisEnabled = computed(() => {
            const direction = this.direction();
            return direction === Directions.BOTH || direction === Directions.HORIZONTAL;
        });

        this._horizontalAxisInvertion = computed(() => {
            const horizontalAxisEnabled = this._horizontalAxisEnabled(), langTextDir = this.langTextDir();
            return horizontalAxisEnabled && langTextDir === TextDirections.RTL;
        });

        this._verticalAxisEnabled = computed(() => {
            const direction = this.direction();
            return direction === Directions.BOTH || direction === Directions.VERTICAL;
        });

        const $direction = toObservable(this.direction),
            $viewportBounds = toObservable(this.viewportBounds),
            $contentBounds = toObservable(this.contentBounds),
            $overscroll = this.$overscroll;

        $overscroll.pipe(
            takeUntilDestroyed(),
            tap(e => {
                this._$overscrollEffectEvent.next(e);
            }),
        ).subscribe();

        combineLatest([$direction, $viewportBounds, $contentBounds]).pipe(
            takeUntilDestroyed(),
            tap(([direction]) => {
                const isHorizontal = direction === Directions.BOTH || direction === Directions.HORIZONTAL,
                    isVertical = direction === Directions.BOTH || direction === Directions.VERTICAL;
                this._service.scrollable = { x: isHorizontal && this.scrollableX, y: isVertical && this.scrollableY };
            }),
        ).subscribe();

        if (this._userInteraction) {
            const root = this._controlContainerService?.emitter ?? window;

            const $wheel = this.$wheel;
            $wheel.pipe(
                takeUntilDestroyed(),
                skipWhile(() => !this.interactive()),
                switchMap(v => of({ v0X: this.averageVelocityX, v0Y: this.averageVelocityY })),
                debounceTime(100),
                tap(({ v0X, v0Y }) => {
                    this._isMoving = false;
                    this._grabbing.set(false);
                    this._overscrollIteration = this._overscrollXIteration = this._overscrollYIteration = 0;
                    this._dragX = this._dragY = 0;
                    this._service.overscroll = { x: false, y: false };
                    this.scrollDirectionX = this.scrollDirectionY = this._scrollDirectionValueX = this._scrollDirectionValueY = 0;
                    this.emitOverscrollEvent(false);
                    this.snapIfNecessary(v0X, v0Y, true, true, true);

                }),
            ).subscribe();

            const $viewport = toObservable(this.scrollViewport).pipe(
                takeUntilDestroyed(this._destroyRef),
                filter(v => !!v),
                map(v => v.nativeElement),
            ), $content = toObservable(this.scrollContent).pipe(
                takeUntilDestroyed(this._destroyRef),
                filter(v => !!v),
                map(v => v.nativeElement),
            ),
                $scrollDisabled = toObservable(this.scrollable).pipe(
                    takeUntilDestroyed(),
                    filter(v => !v),
                ),
                $wheelEmitter = this._inversion ? $viewport : $content;

            if (!!this._controlContainerService && this._controlContainerService.keyboardEnabled) {
                this._controlContainerService.$focusEcho.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    skipWhile(() => !this.interactive()),
                    filter(v => !!v),
                    tap(e => {
                        if (e.serviceId === this._service.id && this._type === ScrollerTypes.SCROLL_VIEW_SCROLLER) {
                            this._controlContainerService.focus({
                                element: e.element, ngControl: e.ngControl,
                                scroller: this, type: this._type, id: e.serviceId,
                            });
                        }
                    }),
                ).subscribe();
            }

            $wheelEmitter.pipe(
                takeUntilDestroyed(this._destroyRef),
                skipWhile(() => !this.interactive()),
                switchMap(content => {
                    return fromEvent<WheelEvent>(content, WHEEL, { passive: false }).pipe(
                        filter(() => this._interactive),
                        takeUntilDestroyed(this._destroyRef),
                        tap(e => {
                            if (!this.scrollable()) {
                                return;
                            }
                            this.emitScrollableEvent();
                            this.stopScrolling();
                            this._isMoving = true;
                            this._grabbing.set(true);
                            const scrollWidth = this.scrollWidth,
                                scrollHeight = this.scrollHeight,
                                startPosX = this._x,
                                startPosY = this._y,
                                deltaX = e.deltaX, dpX = (startPosX + deltaX),
                                deltaY = e.deltaY, dpY = (startPosY + deltaY),
                                dragX = deltaX,
                                dragY = deltaY;
                            this._dragX += this.scrollableX && (this._x <= 0 || this._x >= this.scrollWidth) ? Math.abs(dragX) : 0;
                            this._dragY += this.scrollableY && (this._y <= 0 || this._y >= this.scrollHeight) ? Math.abs(dragY) : 0;
                            if (this._isContainerAllowedForCorrection) {
                                this.horizontalScrollRatioWhenGrabbing = Math.sign(-dragX) < 0 ? 1 : 0;
                            }
                            if (this._isContainerAllowedForCorrection) {
                                this.verticalScrollRatioWhenGrabbing = Math.sign(-dragY) < 0 ? 1 : 0;
                            }
                            this.checkOverscroll(e, true);
                            let positionX = 0, positionY = 0;
                            if (this.isInfinity()) {
                                positionX = dpX;
                                positionY = dpY;
                            } else {
                                positionX = dpX < 0 ? 0 : dpX > scrollWidth ? scrollWidth : dpX;
                                positionY = dpY < 0 ? 0 : dpY > scrollHeight ? scrollHeight : dpY;
                            }
                            const available = this.getAvailabilityPositionsByMovements(positionX, positionY);
                            if (available) {
                                this.scroll({ [LEFT_PROP_NAME]: positionX, [TOP_PROP_NAME]: positionY, behavior: BEHAVIOR_INSTANT, userAction: true, blending: false, fireUpdate: true });
                                this._$wheel.next({ deltaX, deltaY });
                            }
                        }),
                    );
                }),
            ).subscribe();

            if (!isTouchSupported()) {
                const $mouseUp = race([
                    fromEvent<MouseEvent>(root, MOUSE_UP, { passive: true }).pipe(
                        takeUntilDestroyed(this._destroyRef),
                    ),
                    $content.pipe(
                        takeUntilDestroyed(this._destroyRef),
                        switchMap(content => fromEvent<MouseEvent>(content, MOUSE_UP, { passive: true }))
                    ),
                ]),
                    $mouseDragCancel = $mouseUp.pipe(
                        takeUntilDestroyed(this._destroyRef),
                        delay(0),
                        tap(e => {
                            this._controlContainerService.currentScrollView = null;
                            this._isMoving = false;
                            this._grabbing.set(false);
                            if (!mouseCanceled) {
                                this.stopMoving();
                            }
                            mouseCanceled = true;
                            this.cancelOverscroll({ event: e, released: true });
                            if (this.snapToItem() && this.scrollingOneByOne()) {
                                this._isAlignmentAnimation = false;
                                this.alignPosition(true, true);
                            }
                            this._$scrollEnd.next(true);
                        }),
                    );

                $content.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    skipWhile(() => !this.interactive()),
                    switchMap(content => {
                        return fromEvent<MouseEvent>(content, MOUSE_DOWN, { passive: false }).pipe(
                            takeUntilDestroyed(this._destroyRef),
                            filter(() => this._interactive),
                            switchMap(e => {
                                return race([fromEvent<MouseEvent>(root, MOUSE_UP, { passive: false }), fromEvent<MouseEvent>(content, MOUSE_UP, { passive: false })]).pipe(
                                    takeUntilDestroyed(this._destroyRef),
                                    takeUntil(fromEvent<MouseEvent>(root, MOUSE_MOVE, { passive: false })),
                                    takeUntil($scrollDisabled),
                                    tap(e => {
                                        this._controlContainerService.currentScrollView = null;
                                        this._isMoving = false;
                                        this._grabbing.set(false);
                                        if (!mouseCanceled) {
                                            this.stopMoving();
                                        }
                                        mouseCanceled = true;
                                        this.cancelOverscroll({ event: e, released: true });
                                        if (this.snapToItem() && this.scrollingOneByOne()) {
                                            this._isAlignmentAnimation = false;
                                            this.alignPosition(true, true);
                                        }
                                        this._$scrollEnd.next(true);
                                    }),
                                );
                            }),
                        );
                    }),
                ).subscribe();

                $content.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    skipWhile(() => !this.interactive()),
                    switchMap(content => {
                        return fromEvent<MouseEvent>(content, MOUSE_DOWN, { passive: false }).pipe(
                            takeUntilDestroyed(this._destroyRef),
                            filter(v => this._interactive),
                            switchMap(e => {
                                this._controlContainerService.currentScrollView = this;
                                mouseCanceled = false;
                                this._moveIteration = 0;
                                this._clientPositionOffsetX = this._clientPositionOffsetY = 0;
                                this._horizontalAxleLock = this._verticalAxleLock = false;
                                this._overscrollXIteration = this._overscrollYIteration = 0;
                                this._service.overscroll = { x: false, y: false };
                                this.scrollDirectionX = this.scrollDirectionY = this._scrollDirectionValueX = this._scrollDirectionValueY = 0;
                                this.cancelOverscroll();
                                this.onDragStart();
                                this.stopScrolling(true);
                                this.stopMoving();
                                const target = e.target as HTMLElement;
                                if (target.classList.contains(INTERACTIVE)) {
                                    return of(undefined);
                                }
                                const inversion = this._inversion, dt = Date.now();
                                this._isMoving = true;
                                this._grabbing.set(true);
                                this._startPositionX = this.x;
                                this._startPositionY = this.y;
                                this._touchId = -1;
                                let prevClientPositionX: number | null = e.clientX * (this._horizontalAxisInvertion() ? -1 : 1),
                                    prevClientPositionY: number | null = e.clientY,
                                    startClientPosX = prevClientPositionX,
                                    startClientPosY = prevClientPositionY,
                                    offsetsX = new Array<[number, number]>(),
                                    offsetsY = new Array<[number, number]>(),
                                    velocitiesX = new Array<[number, number]>(),
                                    velocitiesY = new Array<[number, number]>(),
                                    startTimeX = dt,
                                    startTimeY = dt,
                                    dragDeltaX = 0,
                                    dragDeltaY = 0;
                                return fromEvent<MouseEvent>(root, MOUSE_MOVE, { passive: false }).pipe(
                                    takeUntilDestroyed(this._destroyRef),
                                    takeUntil($mouseDragCancel),
                                    takeUntil($scrollDisabled),
                                    switchMap(e => {
                                        if (this._isContainerAllowedForCorrection && this._moveIteration === 0) {
                                            if (this.scrollableX) {
                                                startClientPosX -= this._clientPositionOffsetX;
                                            }
                                            if (this.scrollableY) {
                                                startClientPosY -= this._clientPositionOffsetY;
                                            }
                                        }
                                        const { position: posX, currentPos: currentPosX, endTime: endTimeX, scrollDelta: scrollDeltaX } =
                                            this.calculatePosition(false, this._horizontalAxisEnabled(), this._horizontalAxisInvertion(), e, inversion, startClientPosX, startTimeX, prevClientPositionX, offsetsX, velocitiesX),
                                            { position: posY, currentPos: currentPosY, endTime: endTimeY, scrollDelta: scrollDeltaY } =
                                                this.calculatePosition(true, this._verticalAxisEnabled(), false, e, inversion, startClientPosY, startTimeY, prevClientPositionY, offsetsY, velocitiesY);

                                        this._moveIteration++;
                                        const parentScroller = this._service.parent?.scrollView;
                                        if (this._isContainerAllowedForCorrection && !!parentScroller) {
                                            parentScroller.setClientPositionOffset(this.scrollableX ? (startClientPosX - (currentPosX ?? 0)) : 0, this.scrollableY ? (startClientPosY - (currentPosY ?? 0)) : 0);
                                        }

                                        let positionX = posX, positionY = posY;
                                        const absScrollDeltaX = Math.abs(scrollDeltaX),
                                            absScrollDeltaY = Math.abs(scrollDeltaY);
                                        this._scrollDirectionValueX += absScrollDeltaX;
                                        this._scrollDirectionValueY += absScrollDeltaY;
                                        dragDeltaX += absScrollDeltaX;
                                        dragDeltaY += absScrollDeltaY;
                                        const dx = currentPosX === null ? 0 : currentPosX - startClientPosX,
                                            dy = currentPosY === null ? 0 : currentPosY - startClientPosY,
                                            dragX = this._inversion ? (dx >= 0 ? (dx - (this.scrollWidth - this.alignmentRightOffset()) + this._startPositionX) : (dx + this._startPositionX)) : (dx >= 0 ? (dx - this._startPositionX) : (dx - (this._startPositionX - (this.scrollWidth - this.alignmentRightOffset())))),
                                            dragY = this._inversion ? (dy >= 0 ? (dy - (this.scrollHeight - this.alignmentBottomOffset()) + this._startPositionY) : (dy + this._startPositionY)) : (dy >= 0 ? (dy - this._startPositionY) : (dy - (this._startPositionY - (this.scrollHeight - this.alignmentBottomOffset()))));
                                        this._dragX = Math.abs(dragX);
                                        this._dragY = Math.abs(dragY);
                                        if (this._isContainerAllowedForCorrection) {
                                            this.horizontalScrollRatioWhenGrabbing = Math.sign(dragX) < 0 ? 1 : 0;
                                        }
                                        if (this._isContainerAllowedForCorrection) {
                                            this.verticalScrollRatioWhenGrabbing = Math.sign(dragY) < 0 ? 1 : 0;
                                        }
                                        if (this._axleLock) {
                                            this._horizontalAxleLock = this._horizontalAxleLock || this._scrollDirectionValueX < this._scrollDirectionValueY;
                                            this._verticalAxleLock = this._verticalAxleLock || this._scrollDirectionValueY < this._scrollDirectionValueX;
                                            if (this._horizontalAxleLock) {
                                                this._dragX = 0;
                                                this._scrollDirectionValueX = 0;
                                                positionX = this._startPositionX;
                                            } else if (this._verticalAxleLock) {
                                                this._dragY = 0;
                                                this._scrollDirectionValueY = 0;
                                                positionY = this._startPositionY;
                                            }
                                        }

                                        const available = this.getAvailabilityPositionsByMovements(positionX, positionY);
                                        this.checkOverscroll(e);
                                        if (available) {
                                            this.move(positionX, positionY, true, true, true);
                                        }

                                        if (this.isInfinity()) {
                                            const offsetX = Math.abs(positionX) - Math.abs(this._x),
                                                offsetY = Math.abs(positionY) - Math.abs(this._y),
                                                scrollWidth = this.scrollWidth,
                                                scrollHeight = this.scrollHeight,
                                                { width: viewportWidth, height: viewportHeight } = this.viewportBounds();
                                            if (positionX >= (scrollWidth - viewportWidth * .5) || positionX <= 0) {
                                                startClientPosX -= offsetX;
                                            }
                                            if (positionY >= (scrollHeight - viewportHeight * .5) || positionY <= 0) {
                                                startClientPosY -= offsetY;
                                            }
                                        }

                                        startTimeX = endTimeX;
                                        startTimeY = endTimeY;

                                        prevClientPositionX = currentPosX;
                                        prevClientPositionY = currentPosY;
                                        return race([fromEvent<MouseEvent>(root, MOUSE_UP, { passive: false }), fromEvent<MouseEvent>(content, MOUSE_UP, { passive: false })]).pipe(
                                            takeUntilDestroyed(this._destroyRef),
                                            takeUntil($mouseDragCancel),
                                            takeUntil($scrollDisabled),
                                            tap(e => {
                                                this._controlContainerService.currentScrollView = null;
                                                mouseCanceled = true;
                                                const endTime = Date.now(),
                                                    horizontalAxisEnabled = this._horizontalAxisEnabled(),
                                                    verticalAxisEnabled = this._verticalAxisEnabled(),
                                                    timestampX = endTime - startTimeX,
                                                    timestampY = endTime - startTimeY,
                                                    { v0: v0X } = this.calculateVelocity(horizontalAxisEnabled, offsetsX, scrollDeltaX, timestampX),
                                                    { v0: v0Y } = this.calculateVelocity(verticalAxisEnabled, offsetsY, scrollDeltaY, timestampY),
                                                    { a0: a0X } = this.calculateAcceleration(horizontalAxisEnabled, velocitiesX, v0X, timestampX),
                                                    { a0: a0Y } = this.calculateAcceleration(verticalAxisEnabled, velocitiesY, v0Y, timestampY);
                                                this._isMoving = false;
                                                this._grabbing.set(false);
                                                this.cancelOverscroll({ event: e, released: true });
                                                if (available) {
                                                    if ((!this.snapIfNecessary(v0X, v0Y, false)) && this.scrollBehavior() !== BEHAVIOR_INSTANT) {
                                                        this.moveWithAcceleration(
                                                            positionX, v0X, a0X, timestampX,
                                                            positionY, v0Y, a0Y, timestampY,
                                                        );
                                                    } else {
                                                        this.move(positionX, positionY, false, true, true);
                                                        this._$scrollEnd.next(true);
                                                    }
                                                }
                                            }),
                                        );
                                    }),
                                );
                            })
                        );
                    }),
                ).subscribe();
            } else {
                const $touchUp = race(
                    [
                        fromEvent<TouchEvent>(root, TOUCH_END, { passive: false }).pipe(
                            takeUntilDestroyed(this._destroyRef),
                        ),
                        $content.pipe(
                            takeUntilDestroyed(this._destroyRef),
                            switchMap(content => fromEvent<TouchEvent>(content, TOUCH_END, { passive: false })),
                        ),
                    ]
                ),
                    $touchMove = fromEvent<TouchEvent>(root, TOUCH_MOVE, { passive: false }).pipe(
                        takeUntilDestroyed(this._destroyRef),
                    ),
                    $touchCanceler = race([$touchUp.pipe(
                        takeUntilDestroyed(this._destroyRef),
                        delay(0),
                        filter(e => Array.from(e.targetTouches).findIndex(({ identifier }) => identifier === this._touchId) === -1),
                        tap(e => {
                            this._controlContainerService.currentScrollView = null;
                            this._touchId = -1;
                            this._isMoving = false;
                            this._grabbing.set(false);
                            if (!touchCanceled) {
                                this.stopMoving();
                            }
                            touchCanceled = true;
                            this.cancelOverscroll({ event: e, released: true });
                            if ((this.snapToItem() && this.scrollingOneByOne())) {
                                this._isAlignmentAnimation = false;
                                this.alignPosition(true, true);
                            }
                            this._$scrollEnd.next(true);
                        }),
                    ), $touchMove.pipe(
                        takeUntilDestroyed(this._destroyRef),
                        delay(0),
                        filter(e => Array.from(e.targetTouches).findIndex(({ identifier }) => identifier === this._touchId) === -1),
                        tap(() => {
                            this._touchId = -1;
                        }),
                    )]);

                $content.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    skipWhile(() => !this.interactive()),
                    switchMap(content => {
                        return fromEvent<TouchEvent>(content, TOUCH_START, { passive: false }).pipe(
                            takeUntilDestroyed(this._destroyRef),
                            filter(() => this._interactive),
                            switchMap(e => {
                                return race([fromEvent<TouchEvent>(root, TOUCH_END, { passive: false }), fromEvent<TouchEvent>(content, TOUCH_END, { passive: false })]).pipe(
                                    takeUntilDestroyed(this._destroyRef),
                                    takeUntil(fromEvent<TouchEvent>(root, TOUCH_MOVE, { passive: false })),
                                    takeUntil($scrollDisabled),
                                    tap(e => {
                                        this._controlContainerService.currentScrollView = null;
                                        this._touchId = -1;
                                        this._isMoving = false;
                                        this._grabbing.set(false);
                                        if (!touchCanceled) {
                                            this.stopMoving();
                                        }
                                        touchCanceled = true;
                                        if ((this.snapToItem() && this.scrollingOneByOne())) {
                                            this._isAlignmentAnimation = false;
                                            this.alignPosition(true, true);
                                        }
                                        this._$scrollEnd.next(true);
                                    }),
                                );
                            }),
                        );
                    }),
                ).subscribe();

                $content.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    skipWhile(() => !this.interactive()),
                    switchMap(content => {
                        return fromEvent<TouchEvent>(content, TOUCH_START, { passive: false }).pipe(
                            takeUntilDestroyed(this._destroyRef),
                            filter(v => this._interactive),
                            switchMap(e => {
                                this._controlContainerService.currentScrollView = this;
                                touchCanceled = false;
                                this._moveIteration = 0;
                                this._clientPositionOffsetX = this._clientPositionOffsetY = 0;
                                this._horizontalAxleLock = this._verticalAxleLock = false;
                                this._overscrollXIteration = this._overscrollYIteration = 0;
                                this._service.overscroll = { x: false, y: false };
                                this.scrollDirectionX = this.scrollDirectionY = this._scrollDirectionValueX = this._scrollDirectionValueY = 0;
                                this.cancelOverscroll();
                                this.onDragStart();
                                this.stopScrolling(true);
                                this.stopMoving();
                                const target = e.target as HTMLElement;
                                if (target.classList.contains(INTERACTIVE)) {
                                    return of(undefined);
                                }
                                const inversion = this._inversion, dt = Date.now(),
                                    touch = (e.targetTouches?.length ?? 0) > 0 ? e.targetTouches[e.targetTouches.length - 1] : null;
                                if (!touch) {
                                    return of(null);
                                }
                                this._isMoving = true;
                                this._grabbing.set(true);
                                this._startPositionX = this.x;
                                this._startPositionY = this.y;
                                this._touchId = touch.identifier;
                                let prevClientPositionX: number | null = (touch.clientX) * (this._horizontalAxisInvertion() ? -1 : 1),
                                    prevClientPositionY: number | null = touch.clientY,
                                    startClientPosX = prevClientPositionX,
                                    startClientPosY = prevClientPositionY,
                                    offsetsX = new Array<[number, number]>(),
                                    offsetsY = new Array<[number, number]>(),
                                    velocitiesX = new Array<[number, number]>(),
                                    velocitiesY = new Array<[number, number]>(),
                                    startTimeX = dt,
                                    startTimeY = dt,
                                    dragDeltaX = 0,
                                    dragDeltaY = 0;
                                return combineLatest([fromEvent<TouchEvent>(root, TOUCH_MOVE, { passive: false }).pipe(
                                    takeUntilDestroyed(this._destroyRef),
                                    startWith(null),
                                ), fromEvent<TouchEvent>(content, TOUCH_MOVE, { passive: false }).pipe(
                                    takeUntilDestroyed(this._destroyRef),
                                    startWith(null),
                                )]).pipe(
                                    takeUntilDestroyed(this._destroyRef),
                                    takeUntil($touchCanceler),
                                    map(([e1, e2]) => e1 ?? e2),
                                    filter(e => !!e),
                                    switchMap(e => {
                                        if (this._isContainerAllowedForCorrection && this._moveIteration === 0) {
                                            if (this.scrollableX) {
                                                startClientPosX -= this._clientPositionOffsetX;
                                            }
                                            if (this.scrollableY) {
                                                startClientPosY -= this._clientPositionOffsetY;
                                            }
                                        }
                                        const { position: posX, currentPos: currentPosX, endTime: endTimeX, scrollDelta: scrollDeltaX } =
                                            this.calculatePosition(false, this._horizontalAxisEnabled(), this._horizontalAxisInvertion(), e, inversion, startClientPosX, startTimeX, prevClientPositionX, offsetsX, velocitiesX, this._touchId),
                                            { position: posY, currentPos: currentPosY, endTime: endTimeY, scrollDelta: scrollDeltaY } =
                                                this.calculatePosition(true, this._verticalAxisEnabled(), false, e, inversion, startClientPosY, startTimeY, prevClientPositionY, offsetsY, velocitiesY, this._touchId);

                                        this._moveIteration++;
                                        const parentScroller = this._service.parent?.scrollView;
                                        if (this._isContainerAllowedForCorrection && !!parentScroller) {
                                            parentScroller.setClientPositionOffset(startClientPosX - (currentPosX ?? 0), startClientPosY - (currentPosY ?? 0));
                                        }

                                        let positionX = posX, positionY = posY;
                                        const absScrollDeltaX = Math.abs(scrollDeltaX),
                                            absScrollDeltaY = Math.abs(scrollDeltaY);
                                        this._scrollDirectionValueX += absScrollDeltaX;
                                        this._scrollDirectionValueY += absScrollDeltaY;
                                        dragDeltaX += absScrollDeltaX;
                                        dragDeltaY += absScrollDeltaY;
                                        const dx = currentPosX === null ? 0 : currentPosX - startClientPosX,
                                            dy = currentPosY === null ? 0 : currentPosY - startClientPosY,
                                            dragX = this._inversion ? (dx >= 0 ? (dx - (this.scrollWidth - this.alignmentRightOffset()) + this._startPositionX) : (dx + this._startPositionX)) : (dx >= 0 ? (dx - this._startPositionX) : (dx - (this._startPositionX - (this.scrollWidth - this.alignmentRightOffset())))),
                                            dragY = this._inversion ? (dy >= 0 ? (dy - (this.scrollHeight - this.alignmentBottomOffset()) + this._startPositionY) : (dy + this._startPositionY)) : (dy >= 0 ? (dy - this._startPositionY) : (dy - (this._startPositionY - (this.scrollHeight - this.alignmentBottomOffset()))));
                                        this._dragX = Math.abs(dragX);
                                        this._dragY = Math.abs(dragY);
                                        if (this._isContainerAllowedForCorrection) {
                                            this.horizontalScrollRatioWhenGrabbing = Math.sign(dragX) < 0 ? 1 : 0;
                                        }
                                        if (this._isContainerAllowedForCorrection) {
                                            this.verticalScrollRatioWhenGrabbing = Math.sign(dragY) < 0 ? 1 : 0;
                                        }
                                        if (this._axleLock) {
                                            this._horizontalAxleLock = this._horizontalAxleLock || this._scrollDirectionValueX < this._scrollDirectionValueY;
                                            this._verticalAxleLock = this._verticalAxleLock || this._scrollDirectionValueY < this._scrollDirectionValueX;
                                            if (this._horizontalAxleLock) {
                                                this._dragX = 0;
                                                this._scrollDirectionValueX = 0;
                                                positionX = this._startPositionX;
                                            } else if (this._verticalAxleLock) {
                                                this._dragY = 0;
                                                this._scrollDirectionValueY = 0;
                                                positionY = this._startPositionY;
                                            }
                                        }

                                        const available = this.getAvailabilityPositionsByMovements(positionX, positionY);
                                        this.checkOverscroll(e);
                                        if (available) {
                                            this.move(positionX, positionY, true, true, true);
                                        }

                                        if (this.isInfinity()) {
                                            const offsetX = Math.abs(positionX) - Math.abs(this._x),
                                                offsetY = Math.abs(positionY) - Math.abs(this._y),
                                                scrollWidth = this.scrollWidth,
                                                scrollHeight = this.scrollHeight,
                                                { width: viewportWidth, height: viewportHeight } = this.viewportBounds();
                                            if (positionX >= (scrollWidth - viewportWidth * .5) || positionX <= 0) {
                                                startClientPosX -= offsetX;
                                            }
                                            if (positionY >= (scrollHeight - viewportHeight * .5) || positionY <= 0) {
                                                startClientPosY -= offsetY;
                                            }
                                        }

                                        startTimeX = endTimeX;
                                        startTimeY = endTimeY;

                                        prevClientPositionX = currentPosX;
                                        prevClientPositionY = currentPosY;
                                        return race([fromEvent<TouchEvent>(root, TOUCH_END, { passive: false }), fromEvent<TouchEvent>(content, TOUCH_END, { passive: false })]).pipe(
                                            takeUntilDestroyed(this._destroyRef),
                                            takeUntil($touchCanceler),
                                            takeUntil($scrollDisabled),
                                            tap(e => {
                                                this._controlContainerService.currentScrollView = null;
                                                this._touchId = -1;
                                                touchCanceled = true;
                                                const endTime = Date.now(),
                                                    timestampX = endTime - startTimeX,
                                                    timestampY = endTime - startTimeY,
                                                    horizontalAxisEnabled = this._horizontalAxisEnabled(),
                                                    verticalAxisEnabled = this._verticalAxisEnabled(),
                                                    { v0: v0X } = this.calculateVelocity(horizontalAxisEnabled, offsetsX, scrollDeltaX, timestampX),
                                                    { v0: v0Y } = this.calculateVelocity(verticalAxisEnabled, offsetsY, scrollDeltaY, timestampY),
                                                    { a0: a0X } = this.calculateAcceleration(horizontalAxisEnabled, velocitiesX, v0X, timestampX),
                                                    { a0: a0Y } = this.calculateAcceleration(verticalAxisEnabled, velocitiesY, v0Y, timestampY);
                                                this._isMoving = false;
                                                this._grabbing.set(false);
                                                this.cancelOverscroll({ event: e, released: true });
                                                if (available) {
                                                    if (!this.snapIfNecessary(v0X, v0Y, false) && this.scrollBehavior() !== BEHAVIOR_INSTANT) {
                                                        this.moveWithAcceleration(
                                                            positionX, v0X, a0X, timestampX,
                                                            positionY, v0Y, a0Y, timestampY,
                                                        );
                                                    } else {
                                                        this.move(positionX, positionY, false, true, true);
                                                        this._$scrollEnd.next(true);
                                                    }
                                                }
                                            }),
                                        );
                                    }),
                                );
                            })
                        );
                    }),
                ).subscribe();
            }
        }
    }

    getAvailabilityPositionsByMovements(positionX: number, positionY: number): boolean {
        return this._service.getAccessibilityOfMovement(positionX, positionY, this.scrollWidth, this.scrollHeight);
    }

    hasAnimationX(...ids: Array<number>) { return this._animatorX?.hasAnimation(...ids) ?? false; }

    hasAnimationY(...ids: Array<number>) { return this._animatorY?.hasAnimation(...ids) ?? false; }

    hasAnimation(...ids: Array<number>) { return this.hasAnimationX(...ids) || this.hasAnimationY(...ids); }

    protected updateDirectionX(position: number, prePosition: number) {
        const delta = (position - this._deltaX) - prePosition;
        this.scrollDirectionX = Math.sign(delta) as ScrollDirection;
    }

    protected updateDirectionY(position: number, prePosition: number) {
        const delta = (position - this._deltaY) - prePosition;
        this.scrollDirectionY = Math.sign(delta) as ScrollDirection;
    }

    protected override overrideCoordinates(x: number, y: number) {
        super.overrideCoordinates(x, y);
        const time = Date.now(), positionX = Math.abs(x),
            positionY = Math.abs(y);
        this._measureVelocityTimestampX = this._measureVelocityTimestampY = time;
        this._measureVelocityLastPositionX = positionX;
        this._measureVelocityLastPositionY = positionY;
        this.refreshCoordinate(x, y);
    }

    protected measureVelocity() {
        const time = Date.now();
        if (time === this._measureVelocityTimestampX || time === this._measureVelocityTimestampY) {
            return;
        }
        const positionX = this._x,
            positionY = this._y;
        if (!this.isInfinity()) {
            let reseted = false;
            if (this._horizontalAxisEnabled() && (positionX <= 0 || positionX >= this.scrollWidth)) {
                this._velocitiesX = [0];
                this._$averageVelocityX.next(0);
                this._measureVelocityLastPositionX = positionX;
                this._measureVelocityTimestampX = time;
                reseted = true;
            }
            if (this._verticalAxisEnabled() && (positionY <= 0 || positionY >= this.scrollHeight)) {
                this._velocitiesY = [0];
                this._$averageVelocityY.next(0);
                this._measureVelocityLastPositionY = positionY;
                this._measureVelocityTimestampY = time;
                reseted = true;
            }
            if (reseted) {
                return;
            }
        }
        if (this._deltaX === 0) {
            const timeDelta = time - this._measureVelocityTimestampX,
                positionDelta = Math.abs(positionX - this._measureVelocityLastPositionX),
                velocity = timeDelta > 0 ? positionDelta / timeDelta : 0;
            let avgVelocityX = this._velocitiesX.length > 0 ? this._velocitiesX.reduce((p, c) => p + c) : 0;
            if (this._velocitiesX.length >= MAX_ITERATIONS_FOR_AVERAGE_CALCULATIONS) {
                this._velocitiesX.shift();
            }
            avgVelocityX += velocity;
            this._$velocityX.next(velocity);
            this._velocitiesX.push(velocity);
            this._$averageVelocityX.next(avgVelocityX / MAX_ITERATIONS_FOR_AVERAGE_CALCULATIONS);
            this._measureVelocityLastPositionX = positionX;
            this._measureVelocityTimestampX = time;
        }
        if (this._deltaY === 0) {
            const timeDelta = time - this._measureVelocityTimestampY,
                positionDelta = Math.abs(positionY - this._measureVelocityLastPositionY),
                velocity = timeDelta > 0 ? positionDelta / timeDelta : 0;
            let avgVelocityY = this._velocitiesY.length > 0 ? this._velocitiesY.reduce((p, c) => p + c) : 0;
            if (this._velocitiesY.length >= MAX_ITERATIONS_FOR_AVERAGE_CALCULATIONS) {
                this._velocitiesY.shift();
            }
            avgVelocityY += velocity;
            this._$velocityY.next(velocity);
            this._velocitiesY.push(velocity);
            this._$averageVelocityY.next(avgVelocityY / MAX_ITERATIONS_FOR_AVERAGE_CALCULATIONS);
            this._measureVelocityLastPositionY = positionY;
            this._measureVelocityTimestampY = time;
        }
    }

    protected stopMoving() { }

    private snapIfNecessary(v0X: number, v0Y: number, withInitialForce: boolean = true, animated: boolean = true, force: boolean = false) {
        const scrollDirectionX = this.scrollDirectionX || (force ? 1 : 0),
            scrollDirectionY = this.scrollDirectionY || (force ? 1 : 0);
        if (scrollDirectionX === 0 && scrollDirectionY === 0) {
            return false;
        }
        const snapToItem = this.snapToItem();
        if (!!snapToItem) {
            const scrollingOneByOne = this.scrollingOneByOne();
            if (scrollingOneByOne) {
                return this.alignPosition();
            }
            if (withInitialForce) {
                return this.snapWithInitialForceIfNecessary(v0X, v0Y, animated, force);
            }
        }
        return false;
    }

    protected snapWithInitialForceIfNecessary(v0X: number | null = null, v0Y: number | null = null, animated = true, force: boolean = false, fireUpdate: boolean = true) {
        const t = this.animationParams().snapToItem * .01, s = this.getSnappedComponentSize(),
            vaX = s !== null && t !== 0 ? (s.width / t) : 0,
            vaY = s !== null && t !== 0 ? (s.height / t) : 0,
            vX = Math.abs(v0X ?? this.averageVelocityX),
            vY = Math.abs(v0Y ?? this.averageVelocityY);
        if (vaX >= vX || vaY >= vY) {
            return this.alignPosition(animated, force, fireUpdate);
        }
        return false;
    }

    private calculatePosition(isVertical: boolean, enabled: boolean, axisInversion: boolean, e: MouseEvent | TouchEvent | any, inversion: boolean, startClientPos: number, startTime: number,
        prevClientPosition: number | null, offsets: Array<[number, number]>, velocities: Array<[number, number]>, touchId: number = -1,
    ) {
        if (!enabled) {
            return { position: isVertical ? this._y : this._x, currentPos: null, endTime: Date.now(), scrollDelta: 0 };
        }
        const coord = (isVertical ? ((!!e.targetTouches ? Array.from((e as TouchEvent).targetTouches)?.find(({ identifier }) => identifier === touchId)?.clientY ?? 0 : e.clientY)) :
            ((!!e.targetTouches ? Array.from((e as TouchEvent).targetTouches)?.find(({ identifier }) => identifier === touchId)?.clientX ?? 0 : e.clientX))),
            currentPos = coord * (axisInversion ? -1 : 1),
            scrollSize = isVertical ? (this.scrollHeight) : this.scrollWidth, delta = (inversion ? -1 : 1) * (startClientPos - currentPos),
            dp = (isVertical ? this._startPositionY : this._startPositionX) + delta, position = dp < 0 ? 0 : dp > scrollSize ? scrollSize : dp,
            endTime = Date.now(), timestamp = endTime - startTime, scrollDelta = (prevClientPosition === 0 || prevClientPosition === null) ? 0 : prevClientPosition - currentPos,
            { v0 } = this.calculateVelocity(true, offsets, scrollDelta, timestamp);

        this.calculateAcceleration(true, velocities, v0, timestamp);

        return { position, currentPos, endTime, scrollDelta };
    }

    private cancelOverscroll(options?: ICancelOverscrollOptions) {
        if (options?.released && !this._service.overscroll.x && !this._service.overscroll.y && !!this._controlContainerService) {
            this._controlContainerService.overscrollCancel({ element: (options?.event?.target as HTMLElement) ?? this._elementRef.nativeElement, ngControl: null, scroller: this, type: this._type!, id: this._service.id });
        }
        this._overscrollIteration = this._dragX = this._dragY = 0;
        this.emitOverscrollEvent(false, !this.overscrollEnabled());
    }

    private checkOverscrollByAxis(e: Event, pos: number, limit: number): boolean {
        const p = Math.abs(pos);
        if (p > 0 && p < limit) {
            this._overscrollIteration = 0;
            if (e.cancelable) {
                e.stopImmediatePropagation();
                e.preventDefault();
                return true;
            }
        } else {
            if (this._overscrollIteration < OVERSCROLL_START_ITERATION) {
                this._overscrollIteration++;
                if (e.cancelable) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return true;
                }
            }
            this.emitOverscrollEvent();
        }
        return false;
    }

    private checkOverscroll(e: Event, wheel: boolean = false) {
        if (!this._overscrollEnabled || !this.overscrollEnabled()) {
            if (e.cancelable) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
            return;
        }

        if (this._overscrollEnabled) {
            const overscrollX = this._service.overscroll.x,
                overscrollY = this._service.overscroll.y;
            this._userScrollDirectionIsHorizontal = this._scrollDirectionValueX > this._scrollDirectionValueY;
            if (this._userScrollDirectionIsHorizontal) {
                if (!overscrollY && getScrollable(this._service, X_PROP_NAME, true)) {
                    if (this._overscrollXIteration < OVERSCROLL_START_ITERATION) {
                        this._overscrollXIteration++;
                        this.checkOverscrollByAxis(e, this._x, this.scrollWidth);
                    } else {
                        this._service.overscroll = { ...this._service.overscroll, x: true };
                        this.checkOverscrollByAxis(e, this._x, this.scrollWidth);
                    }
                } else {
                    if (e.cancelable) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                    const p = Math.abs(this._x);
                    if (p <= 0 || p >= this.scrollWidth) {
                        this.emitOverscrollEvent();
                    }
                }
            } else {
                if (!overscrollX && getScrollable(this._service, Y_PROP_NAME, true)) {
                    if (this._overscrollYIteration < OVERSCROLL_START_ITERATION) {
                        this._overscrollYIteration++;
                        this.checkOverscrollByAxis(e, this._y, this.scrollHeight);
                    } else {
                        this._service.overscroll = { ...this._service.overscroll, y: true };
                        this.checkOverscrollByAxis(e, this._y, this.scrollHeight);
                    }
                } else {
                    if (e.cancelable) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                    const p = Math.abs(this._y);
                    if (p <= 0 || p >= this.scrollHeight) {
                        this.emitOverscrollEvent();
                    }
                }
            }
        }
    }

    private createOverflowEvent(grabbing: boolean, exp: number = DEFAULT_TRANSITION_EXPONENT) {
        const bounds = this.viewportBounds(), event = new OverscrollEvent({
            grabbing,
            dragX: transitionExponent(this._horizontalScrollRatio <= 0 || this._horizontalScrollRatio >= 1 ? this._dragX : 0, bounds.width, exp),
            dragY: transitionExponent(this._verticalScrollRatio <= 0 || this._verticalScrollRatio >= 1 ? this._dragY : 0, bounds.height, exp),
            positionX: ((this.langTextDir() === TextDirections.LTR ? (this.horizontalScrollRatioWhenGrabbing === 1 ? 1 : 0) : (this.horizontalScrollRatioWhenGrabbing === 1 ? 0 : 1))),
            positionY: (this.verticalScrollRatioWhenGrabbing === 1 ? 1 : 0),
        });
        return event;
    }

    protected emitOverscrollEffectEvent(grabbing: boolean = true, exp: number = DEFAULT_TRANSITION_EXPONENT) {
        if (!this._isContainerAllowedForCorrection) {
            return;
        }
        const event = this.createOverflowEvent(grabbing, exp),
            overscrollService = this.overscrollService();
        if (!!overscrollService) {
            overscrollService.emit(event, true);
        } else {
            this._$overscrollEffectEvent.next(event);
        }
        const parentScroller = this._service.parent?.scrollView;
        if (!!parentScroller) {
            parentScroller.setOverscrollEffectEvent(event);
        }
    }

    protected emitOverscrollEvent(grabbing: boolean = true, output: boolean = true, exp: number = DEFAULT_TRANSITION_EXPONENT) {
        if (!this._isContainerAllowedForCorrection) {
            return;
        }
        const event = this.createOverflowEvent(grabbing, exp),
            overscrollService = this.overscrollService();
        if (!!overscrollService) {
            overscrollService.emit(event);
        } else {
            this._$overscroll.next(event);
        }
        const parentScroller = this._service.parent?.scrollView;
        if (!!parentScroller) {
            parentScroller.setOverscrollEvent(event);
        }
        if (output) {
            this.onOverscroll.emit(event);
        }
    }

    private calculateVelocity(enabled: boolean, offsets: Array<[number, number]>, delta: number, timestamp: number, indexOffset: number = 10) {
        if (!enabled) {
            return { v0: 0 };
        }
        if (offsets.length > MAX_VELOCITIES_LENGTH) {
            offsets.shift();
        }
        offsets.push([delta, timestamp < ANIMATOR_MIN_TIMESTAMP ? ANIMATOR_MIN_TIMESTAMP : timestamp]);

        const len = offsets.length, startIndex = len > indexOffset ? len - indexOffset : 0, lastVSign = calculateDirection(offsets),
            speedScale = this.scrollingSettings()?.speedScale ?? SPEED_SCALE;
        let vSum = 0;
        for (let i = startIndex, l = offsets.length; i < l; i++) {
            const p0 = offsets[i];
            if (lastVSign !== Math.sign(p0[0])) {
                continue;
            }

            const v0 = (p0[1] !== 0 ? lastVSign * Math.abs(p0[0] / p0[1]) * speedScale : 0);
            vSum += Math.sign(v0) * Math.pow(v0, 4) * .003;
        }

        const l = Math.min(offsets.length, indexOffset), v0 = Math.abs(l > 0 ? (vSum / l) : 0) * Math.sign(vSum);
        return { v0 };
    }

    private calculateAcceleration(enabled: boolean, velocities: Array<[number, number]>, delta: number, timestamp: number, indexOffset: number = 10) {
        if (!enabled) {
            return { a0: 0 };
        }
        if (velocities.length > MAX_VELOCITIES_LENGTH) {
            velocities.shift();
        }
        velocities.push([Math.abs(delta) < MIN_DELTA ? 0 : delta, timestamp < ANIMATOR_MIN_TIMESTAMP ? ANIMATOR_MIN_TIMESTAMP : timestamp]);
        const len = velocities.length, startIndex = len > indexOffset ? len - indexOffset : 0;
        let aSum = 0, prevV0: [number, number] | undefined, iteration = 0, lastVSign = calculateDirection(velocities);
        const mass = this.scrollingSettings()?.mass ?? MASS;
        for (let i = startIndex, l = velocities.length; i < l; i++) {
            const v00 = prevV0, v01 = velocities[i];
            if (lastVSign !== Math.sign(v01[0])) {
                continue;
            }
            if (v00) {
                const a0 = timestamp < MAX_VELOCITY_TIMESTAMP ? (v00[1] !== 0 ? (lastVSign * Math.abs(Math.abs(v01[0]) - Math.abs(v00[0]))) / Math.abs(v00[1]) : 0) : .1;
                aSum = Math.abs((aSum * mass)) + Math.abs(a0);
                prevV0 = v01;
            }
            prevV0 = v01;
            iteration++;
        }

        const a0 = aSum * (this.scrollingSettings()?.frictionalForce ?? FRICTION_FORCE);
        return { a0: Math.abs(a0) < MIN_ACCELERATION ? 0 : a0 };
    }

    stopScrolling(force: boolean = false) {
        if (this._isAlignmentAnimation && !force) {
            return;
        }
        this._isAlignmentAnimation = false;
        this._animatorX.stop();
        this._animatorY.stop();
    }

    protected move(x: number | null, y: number | null, blending: boolean = false, userAction: boolean = false, fireUpdate: boolean = true) {
        this.scroll({ [LEFT_PROP_NAME]: x, [TOP_PROP_NAME]: y, behavior: BEHAVIOR_INSTANT, blending, userAction, fireUpdate });
    }

    private calculateParamsWithVelocity(position: number, v: number, a0: number, startPosition: number): {
        startPosition: number;
        endPosition: number;
        duration: number;
    } {
        const dvSign = Math.sign(v) || 1,
            mass = this.scrollingSettings()?.mass ?? MASS,
            duration = DURATION, maxDuration = this.scrollingSettings()?.maxDuration ?? MAX_DURATION,
            maxDist = this.scrollingSettings()?.maxDistance ?? MAX_DIST,
            maxDistance = dvSign * maxDist, s = (dvSign * Math.abs((a0 * Math.pow(duration, 2)) * .5) / 10000) / mass,
            distance = Math.abs(s) < maxDist ? s : maxDistance, positionWithVelocity = position + (this._inversion ? -1 : 1) * distance,
            ad = Math.abs(a0 !== 0 ? Math.sqrt(a0) : 0) * ACCELERATION_SCALE / mass,
            aDuration = ad < maxDuration ? ad : maxDuration;
        return {
            startPosition,
            endPosition: positionWithVelocity,
            duration: aDuration,
        };
    }

    protected moveWithAcceleration(positionX: number, vX: number, a0X: number, timestampX: number,
        positionY: number, vY: number, a0Y: number, timestampY: number
    ) {
        const animateX = a0X !== 0 && timestampX < MAX_VELOCITY_TIMESTAMP,
            animateY = a0Y !== 0 && timestampY < MAX_VELOCITY_TIMESTAMP;
        if (animateX || animateY) {
            if (animateX && animateY) {
                const { startPosition: startPositionX, endPosition: endPositionX, duration: durationX } = this.calculateParamsWithVelocity(positionX, vX, a0X, this.x),
                    { startPosition: startPositionY, endPosition: endPositionY, duration: durationY } = this.calculateParamsWithVelocity(positionY, vY, a0Y, this.y),
                    duration = Math.max(durationX, durationY);
                this.animate(X_PROP_NAME, startPositionX, endPositionX, duration, easeOutQuad, false, true);
                this.animate(Y_PROP_NAME, startPositionY, endPositionY, duration, easeOutQuad, false, true);
            } else if (animateX) {
                const { startPosition, endPosition, duration } = this.calculateParamsWithVelocity(positionX, vX, a0X, this.x);
                this.animate(X_PROP_NAME, startPosition, endPosition, duration, easeOutQuad, false, true);
            } else if (animateY) {
                const { startPosition, endPosition, duration } = this.calculateParamsWithVelocity(positionY, vY, a0Y, this.y);
                this.animate(Y_PROP_NAME, startPosition, endPosition, duration, easeOutQuad, false, true);
            }
        } else {
            this.alignPosition(true, true);
        }
    }

    protected normalizeValueX(value: number) {
        if (this.isInfinity()) {
            return value;
        }
        const startOffset = this._normalizeValueFromZero ? 0 : this.leftOffset(),
            scrollable = this.scrollableX,
            scrollSize = scrollable ? (this.scrollWidth - this.alignmentRightOffset()) : 0,
            result = scrollable ? (value <= startOffset ? startOffset : value > scrollSize ? scrollSize : value) : startOffset;
        return result;
    }

    protected normalizeValueY(value: number) {
        if (this.isInfinity()) {
            return value;
        }
        const startOffset = this._normalizeValueFromZero ? 0 : this.topOffset(),
            scrollable = this.scrollableY,
            scrollSize = scrollable ? (this.scrollHeight - this.alignmentBottomOffset()) : 0,
            result = scrollable ? (value <= startOffset ? startOffset : value > scrollSize ? scrollSize : value) : startOffset;
        return result;
    }

    protected animate(axis: typeof X_PROP_NAME | typeof Y_PROP_NAME, startValue: number, endValue: number, duration = ANIMATION_DURATION, easingFunction: Easing = easeOutQuad, blending: boolean = false,
        userAction: boolean = false, alignmentAtComplete: boolean = true, skipOverridedCoordinates: boolean = false, fireUpdate: boolean = true, onUpdate: ((data: IAnimatorUpdateData) => void) | null = null,
        onComplete: ((data: IAnimatorUpdateData) => void) | null = null): number {
        const isVertical = axis === Y_PROP_NAME, animator = isVertical ? this._animatorY : this._animatorX;
        let position = startValue;
        this._isAlignmentAnimation = !alignmentAtComplete;

        if (this.hasAnimation() && blending) {
            const updatable = animator.updateTo(endValue);
            if (updatable) {
                return animator.id;
            }
        }
        let overflowTime: number | null = null, overscrollEffectCanceled = -1;
        return animator.animate({
            withDelta: !this.isInfinity(),
            startValue,
            endValue,
            duration,
            easingFunction,
            getPropValue: () => {
                return isVertical ? this._y : this._x;
            }, onUpdate: data => {
                this._userActionDuringAnimation.set(userAction);
                const { value, timestamp, elapsed, complete } = data;
                if (this._isCoordinatesOverrided && !skipOverridedCoordinates) {
                    this._isCoordinatesOverrided = false;
                    const currentCoordinate = isVertical ? this._y : this._x, delta = endValue - value;
                    this.animate(axis, currentCoordinate, currentCoordinate + delta, duration - elapsed, easingFunction, blending, userAction, alignmentAtComplete, false, true);
                    return;
                }
                const time = Date.now(), scrollSize = (isVertical ? this.scrollHeight : this.scrollWidth);
                if (!overflowTime && (value! <= 0 || value! >= scrollSize)) {
                    overflowTime = Date.now();
                }
                if (!!overflowTime && ((time - overflowTime) < OVERSCROLL_EFFECT_TIME)) {
                    overscrollEffectCanceled = 0;

                    if (this._isContainerAllowedForCorrection) {
                        const dv = value!,
                            dragV = dv < 0 ? dv : (dv - scrollSize),
                            normalizedDrag = Math.abs(dragV),
                            dragSign = Math.sign(dragV),
                            pos = dragSign > 0 ? 1 : 0;
                        if (isVertical) {
                            this._dragY = normalizedDrag;
                            if (this.scrollableY) {
                                this.verticalScrollRatioWhenGrabbing = pos;
                            }
                        } else {
                            this._dragX = normalizedDrag;
                            if (this.scrollableX) {
                                this.horizontalScrollRatioWhenGrabbing = pos;
                            }
                        }
                        this.emitOverscrollEffectEvent(userAction);
                    }
                } else if (overscrollEffectCanceled === 0) {
                    overscrollEffectCanceled = 1;
                    complete();
                }

                const v0 = calculateVelocity(position, value - (isVertical ? this._deltaY : this._deltaX), timestamp) ?? (isVertical ? this.averageVelocityY : this.averageVelocityX);
                position = value!;
                if (alignmentAtComplete && !this._isAlignmentAnimation && !skipOverridedCoordinates) {
                    if (!this.snapIfNecessary(isVertical ? 0 : v0, isVertical ? v0 : 0)) {
                        this.move(isVertical ? null : value, isVertical ? value : null, false, userAction, fireUpdate);
                    }
                } else {
                    this.move(isVertical ? null : value, isVertical ? value : null, false, userAction, fireUpdate);
                }
                this._service.update(true);
                if (typeof onUpdate === 'function') {
                    onUpdate(data);
                }
            }, onComplete: data => {
                this._isAlignmentAnimation = false;
                this._userActionDuringAnimation.set(false);
                const { timestamp } = data;
                const v0 = calculateVelocity(position, endValue, timestamp);
                if (this._isContainerAllowedForCorrection) {
                    overscrollEffectCanceled = 1;
                    this._dragX = this._dragY = 0;
                    this.emitOverscrollEffectEvent(false);
                }
                if (alignmentAtComplete && !this._isAlignmentAnimation && !skipOverridedCoordinates) {
                    this.snapIfNecessary(isVertical ? 0 : v0, isVertical ? v0 : 0);
                } else {
                    this.move(isVertical ? null : endValue!, isVertical ? endValue : null, false, userAction, fireUpdate);
                }
                this._$scrollEnd.next(userAction);
                this._service.update(true);;
                this.onAnimationComplete(endValue);
                if (typeof onComplete === 'function') {
                    onComplete(data);
                }
            },
        });
    }

    protected getSnappedComponentSize(): ISize | null {
        const align = this.snapToItemAlign(),
            sd = this.snappingDistance(),
            snappingDistance = parseFloatOrPersentageValue(sd),
            isPersentageSnappingDistance = isPercentageValue(sd);
        let size: ISize | null = null;
        const scrollDirectionX = this.scrollDirectionX,
            scrollDirectionY = this.scrollDirectionY,
            currentPositionX = this.scrollLeft - this._startLayoutOffsetX,
            currentPositionY = this.scrollTop - this._startLayoutOffsetY,
            currentComponentBounds = this._service.getComponentBoundsByIntersectionPosition(currentPositionX, currentPositionY),
            currentComponentWidth = currentComponentBounds?.width ?? 0,
            currentComponentHeigth = currentComponentBounds?.height ?? 0;
        switch (align) {
            case SnapToItemAligns.START: {
                const offsetX = ((scrollDirectionX === 1 ? currentComponentWidth : 0) - (isPersentageSnappingDistance ? currentComponentWidth * snappingDistance : snappingDistance)) * scrollDirectionX,
                    offsetY = ((scrollDirectionY === 1 ? currentComponentHeigth : 0) - (isPersentageSnappingDistance ? currentComponentHeigth * snappingDistance : snappingDistance)) * scrollDirectionY,
                    componentBounds = this._service.getComponentBoundsByIntersectionPosition(currentPositionX + offsetX, currentPositionY + offsetY);
                if (!!componentBounds) {
                    const { width, height } = componentBounds;
                    size = {
                        width,
                        height,
                    };
                }
                break;
            }
            case SnapToItemAligns.CENTER: {
                const viewportWidth = this.viewportBounds().width,
                    viewportHeight = this.viewportBounds().height,
                    offsetX = (currentComponentWidth * .5 - (isPersentageSnappingDistance ? currentComponentWidth * snappingDistance : snappingDistance)) * scrollDirectionX,
                    offsetY = (currentComponentHeigth * .5 - (isPersentageSnappingDistance ? currentComponentHeigth * snappingDistance : snappingDistance)) * scrollDirectionY,
                    actualPosX = currentPositionX + offsetX + viewportWidth * .5,
                    actualPosY = currentPositionY + offsetY + viewportHeight * .5,
                    maxPosX = this.scrollWidth,
                    maxPosY = this.scrollHeight,
                    posX = Math.min(actualPosX, maxPosX),
                    posY = Math.min(actualPosY, maxPosY);
                const componentBounds = this._service.getComponentBoundsByIntersectionPosition(posX, posY);
                if (!!componentBounds) {
                    const { width, height } = componentBounds;
                    size = {
                        width,
                        height,
                    };
                }
                break;
            }
            case SnapToItemAligns.END: {
                const viewportWidth = this.viewportBounds().width,
                    viewportHeight = this.viewportBounds().height,
                    offsetX = ((scrollDirectionX === 1 ? currentComponentWidth : 0) - (isPersentageSnappingDistance ? currentComponentWidth * snappingDistance : snappingDistance)) * scrollDirectionX,
                    offsetY = ((scrollDirectionY === 1 ? currentComponentHeigth : 0) - (isPersentageSnappingDistance ? currentComponentHeigth * snappingDistance : snappingDistance)) * scrollDirectionY,
                    actualPosX = currentPositionX + offsetX + viewportWidth,
                    actualPosY = currentPositionY + offsetY + viewportHeight,
                    maxPosX = this.scrollWidth,
                    maxPosY = this.scrollHeight,
                    posX = Math.min(actualPosX, maxPosX),
                    posY = Math.min(actualPosY, maxPosY);
                const componentBounds = this._service.getComponentBoundsByIntersectionPosition(posX, posY);
                if (!!componentBounds) {
                    const { width, height } = componentBounds;
                    size = {
                        width,
                        height,
                    };
                }
                break;
            }
        }
        return size;
    }

    protected alignPosition(animated: boolean = true, force: boolean = false, fireUpdate: boolean = false) {
        if (this._disableAlignment || !this.snapToItem() || (this._isAlignmentAnimation && !force)) {
            return false;
        }
        const scrollDirectionX = this.scrollDirectionX || (force ? 1 : 0),
            scrollDirectionY = this.scrollDirectionY || (force ? 1 : 0);
        if (scrollDirectionX === 0 && scrollDirectionY === 0) {
            return false;
        }
        const align = this.snapToItemAlign(),
            viewportWidth = this.viewportBounds().width,
            viewportHeight = this.viewportBounds().height,
            sd = this.snappingDistance(),
            snappingDistance = parseFloatOrPersentageValue(sd),
            isPersentageSnappingDistance = isPercentageValue(sd);
        let position: IPoint | null = null;
        const currentPositionX = this.scrollLeft - this._startLayoutOffsetX,
            currentPositionY = this.scrollTop - this._startLayoutOffsetY,
            currentComponentBounds = this._service.getComponentBoundsByIntersectionPosition(currentPositionX, currentPositionY),
            currentComponentWidth = currentComponentBounds?.width ?? 0,
            currentComponentHeight = currentComponentBounds?.height ?? 0;
        switch (align) {
            case SnapToItemAligns.START: {
                const offsetX = ((scrollDirectionX === 1 ? currentComponentWidth : 0) - (isPersentageSnappingDistance ? currentComponentWidth * snappingDistance : snappingDistance)) * scrollDirectionX,
                    offsetY = ((scrollDirectionY === 1 ? currentComponentHeight : 0) - (isPersentageSnappingDistance ? currentComponentHeight * snappingDistance : snappingDistance)) * scrollDirectionY,
                    componentBounds = this._service.getComponentBoundsByIntersectionPosition(currentPositionX + offsetX, currentPositionY + offsetY);
                if (!!componentBounds) {
                    const { x, y } = componentBounds, leftOffset = this.leftOffset(), topOffset = this.topOffset(),
                        alignmentLeftOffset = this.alignmentLeftOffset(), alignmentTopOffset = this.alignmentTopOffset(),
                        maxPosX = this.scrollWidth - (leftOffset - alignmentLeftOffset) + this._startLayoutOffsetX,
                        maxPosY = this.scrollHeight - (topOffset - alignmentTopOffset) + this._startLayoutOffsetY;
                    position = {
                        x: x - (leftOffset - alignmentLeftOffset) + this._startLayoutOffsetX,
                        y: y - (topOffset - alignmentTopOffset) + this._startLayoutOffsetY,
                    }
                    if (this.isInfinity()) {
                        if (position.x < 0 || position.x > maxPosX) {
                            position.x = maxPosX;
                            this._x = this.scrollWidth;
                        }
                        if (position.y < 0 || position.y > maxPosY) {
                            position.y = maxPosY;
                            this._y = this.scrollHeight;
                        }
                    }
                }
                break;
            }
            case SnapToItemAligns.CENTER: {
                const offsetX = (currentComponentWidth * .5 - (isPersentageSnappingDistance ? currentComponentWidth * snappingDistance : snappingDistance)) * scrollDirectionX,
                    offsetY = (currentComponentHeight * .5 - (isPersentageSnappingDistance ? currentComponentHeight * snappingDistance : snappingDistance)) * scrollDirectionY,
                    actualPosX = currentPositionX + offsetX + viewportWidth * .5,
                    actualPosY = currentPositionY + offsetY + viewportHeight * .5,
                    maxPosX = this.scrollWidth,
                    maxPosY = this.scrollHeight,
                    posX = Math.min(actualPosX, maxPosX),
                    posY = Math.min(actualPosY, maxPosY);
                const componentBounds = this._service.getComponentBoundsByIntersectionPosition(posX, posY);
                if (!!componentBounds) {
                    const { x, y, width, height } = componentBounds, leftOffset = this.leftOffset(), alignmentLeftOffset = this.alignmentLeftOffset(),
                        topOffset = this.topOffset(), alignmentTopOffset = this.alignmentTopOffset();
                    const maxPosX = this.scrollWidth - width * .5 - viewportWidth * .5 - (leftOffset - alignmentLeftOffset) * .5,
                        maxPosY = this.scrollHeight - height * .5 - viewportHeight * .5 - (topOffset - alignmentTopOffset) * .5;
                    position = {
                        x: x + width * .5 - viewportWidth * .5 - (leftOffset - alignmentLeftOffset) * .5 + this._startLayoutOffsetX,
                        y: y + height * .5 - viewportHeight * .5 - (topOffset - alignmentTopOffset) * .5 + this._startLayoutOffsetY,
                    };
                    if (this.isInfinity()) {
                        if (position.x <= 0 || position.x > maxPosX) {
                            position.x = maxPosX;
                            this._x = this.scrollWidth;
                        }
                        if (position.y <= 0 || position.y > maxPosY) {
                            position.y = maxPosY;
                            this._y = this.scrollHeight;
                        }
                    }
                }
                break;
            }
            case SnapToItemAligns.END: {
                const offsetX = ((scrollDirectionX === 1 ? currentComponentWidth : 0) - (isPersentageSnappingDistance ? currentComponentWidth * snappingDistance : snappingDistance)) * scrollDirectionX,
                    offsetY = ((scrollDirectionY === 1 ? currentComponentHeight : 0) - (isPersentageSnappingDistance ? currentComponentHeight * snappingDistance : snappingDistance)) * scrollDirectionY,
                    actualPosX = currentPositionX + offsetX + viewportWidth,
                    actualPosY = currentPositionY + offsetY + viewportHeight,
                    maxPosX = this.scrollWidth,
                    maxPosY = this.scrollHeight,
                    posX = Math.min(actualPosX, maxPosX),
                    posY = Math.min(actualPosY, maxPosY);
                const componentBounds = this._service.getComponentBoundsByIntersectionPosition(posX, posY);
                if (!!componentBounds) {
                    const { x, y } = componentBounds;
                    position = {
                        x: x - viewportWidth + this._startLayoutOffsetX,
                        y: y - viewportHeight + this._startLayoutOffsetY,
                    };
                }
                break;
            }
        }

        const cPosX = this.scrollLeft,
            cPosY = this.scrollTop;

        if (position !== null && !(position.x === cPosX && position.y === cPosY)) {
            this.stopScrolling(true);
            this.animate(X_PROP_NAME, cPosX, position.x, animated ? this.animationParams().snapToItem : 1, easeOutQuad, false, false, false, true, fireUpdate);
            this.animate(Y_PROP_NAME, cPosY, position.y, animated ? this.animationParams().snapToItem : 1, easeOutQuad, false, false, false, true, fireUpdate);
            return true;
        }
        return false;
    }

    protected checkIntersectionComponent() {
        const align = this.snapToItemAlign(),
            viewportWidth = this.viewportBounds().width,
            viewportHeight = this.viewportBounds().height;
        let componentId: Id | null = null;
        const currentPositionX = this.scrollLeft - this._startLayoutOffsetX,
            currentPositionY = this.scrollTop - this._startLayoutOffsetY;
        switch (align) {
            case SnapToItemAligns.START: {
                const maxPosX = this.scrollWidth,
                    maxPosY = this.scrollHeight,
                    componentBounds = this._service.getComponentBoundsByIntersectionPosition(currentPositionX, currentPositionY, maxPosX, maxPosY);
                if (!!componentBounds) {
                    const { id } = componentBounds;
                    componentId = id;
                }
                break;
            }
            case SnapToItemAligns.CENTER: {
                const actualPosX = currentPositionX + viewportWidth * .5,
                    actualPosY = currentPositionY + viewportHeight * .5,
                    maxPosX = this.scrollWidth,
                    maxPosY = this.scrollHeight,
                    posX = Math.min(actualPosX, maxPosX),
                    posY = Math.min(actualPosY, maxPosY);
                const componentBounds = this._service.getComponentBoundsByIntersectionPosition(posX, posY, maxPosX, maxPosY);
                if (!!componentBounds) {
                    const { id } = componentBounds;
                    componentId = id;
                }
                break;
            }
            case SnapToItemAligns.END: {
                const actualPosX = currentPositionX + viewportWidth,
                    actualPosY = currentPositionY + viewportHeight,
                    maxPosX = this.scrollWidth,
                    maxPosY = this.scrollHeight,
                    posX = Math.min(actualPosX, maxPosX),
                    posY = Math.min(actualPosY, maxPosY);
                const componentBounds = this._service.getComponentBoundsByIntersectionPosition(posX, posY, maxPosX, maxPosY);
                if (!!componentBounds) {
                    const { id } = componentBounds;
                    componentId = id;
                }
                break;
            }
        }

        if (componentId !== this._intersectionComponentId && componentId !== null) {
            this._service.setIntersectionElementBySnapToItemAlign(componentId);
        }
        this._intersectionComponentId = componentId;
    }

    protected override normalizeScrollWidth() {
        const result = super.normalizeScrollWidth();
        this.scrollLimits();
        return result;
    }

    protected override normalizeScrollHeight() {
        const result = super.normalizeScrollHeight();
        this.scrollLimits();
        return result;
    }

    protected onAnimationComplete(position: number | null) { }

    protected dropVelocity() {
        const time = Date.now(),
            positionX = this._x,
            positionY = this._y;
        let reseted = false;
        this._velocitiesX = [0];
        this._$averageVelocityX.next(0);
        this._measureVelocityLastPositionX = positionX;
        this._measureVelocityTimestampX = time;
        reseted = true;
        this._velocitiesY = [0];
        this._$averageVelocityY.next(0);
        this._measureVelocityLastPositionY = positionY;
        this._measureVelocityTimestampY = time;
        reseted = true;
    }

    fireScroll(userAction: boolean = false) {
        this._$updateScrollBarHorizontal.next();
        this._$updateScrollBarVertical.next();
        this.emitScrollableEvent();
        this.fireScrollEvent(userAction);
    }

    scrollLimits(value?: number | undefined, silent: boolean = false): boolean {
        if (!this.isInfinity()) {
            const x = value !== undefined ? value : this._x, y = value !== undefined ? value : this._y,
                yy = this.normalizeValueY(y), xx = this.normalizeValueX(x);
            if (y !== yy) {
                if (silent) {
                    this._y = yy;
                    this.refreshCoordinate(this._x, this._y);
                } else {
                    this.y = yy;
                }
                return true;
            }
            if (x !== xx) {
                if (silent) {
                    this._x = xx;
                    this.refreshCoordinate(this._x, this._y);
                } else {
                    this.x = xx;
                }
                return true;
            }
        }
        return false;
    }

    protected resetDrag() {
        this._dragX = this._dragY = 0;
    }

    scroll(params: IScrollToParams): Array<number> | null {
        const animationIds = new Array<number>(),
            posX = params.x ?? params.left ?? null,
            posY = params.y ?? params.top ?? null,
            userAction = params.userAction ?? false,
            snap = params.snap ?? true,
            normalize = params.normalize ?? true,
            ease = params.ease || easeOutQuad,
            fireUpdate = params.fireUpdate ?? true,
            onUpdate = params.onUpdate ?? null,
            onComplete = params.onComplete ?? null,
            behavior = params.behavior ?? BEHAVIOR_INSTANT,
            blending = params.blending ?? true,
            force = params.force ?? false,
            duration = params.duration ?? ANIMATION_DURATION,
            horizontalAxisEnabled = this._horizontalAxisEnabled(),
            verticalAxisEnabled = this._verticalAxisEnabled();

        const x = posX !== null ? this.normalizeValueX(posX) : null,
            y = posY !== null ? this.normalizeValueY(posY) : null,
            prevX = this._x,
            prevY = this._y;
        if (behavior === BEHAVIOR_AUTO || behavior === BEHAVIOR_SMOOTH) {
            if (horizontalAxisEnabled && x !== null && prevX !== x) {
                const id = this.animate(X_PROP_NAME, prevX, x, duration, ease, blending, userAction, false, false, fireUpdate, onUpdate, onComplete);
                animationIds.push(id);
            }
            if (verticalAxisEnabled && y !== null && prevY !== y) {
                const id = this.animate(Y_PROP_NAME, prevY, y, duration, ease, blending, userAction, false, false, fireUpdate, onUpdate, onComplete);
                animationIds.push(id);
            }
            return animationIds;
        } else {
            if (horizontalAxisEnabled && x !== null && (x !== prevX || force)) {
                this.setX(x, snap, normalize);
                const scrollWidth = Math.abs(this.scrollWidth - this.alignmentRightOffset()),
                    xx = Math.abs(this._x);
                this._horizontalScrollRatio = scrollWidth !== 0 ? (xx / scrollWidth) : 0;
                if (userAction) {
                    if (this._isContainerAllowedForCorrection && this.grabbing && this.scrollableX) {
                        this.horizontalScrollRatioWhenGrabbing = this._horizontalScrollRatio <= 0 ? 0 : 1;
                    }
                }
                this.emitScrollableEvent();
                if (fireUpdate) {
                    this.fireScrollEvent(userAction);
                }
            } else if (horizontalAxisEnabled && x !== null) {
                this.updateDirectionX(x, this._x);
            }
            if (verticalAxisEnabled && y !== null && (y !== prevY || force)) {
                this.setY(y, snap, normalize);
                const scrollHeight = Math.abs(this.scrollHeight - this.alignmentBottomOffset()),
                    yy = Math.abs(this._y);
                this._verticalScrollRatio = scrollHeight !== 0 ? yy / scrollHeight : 0;
                if (userAction) {
                    if (this._isContainerAllowedForCorrection && this.grabbing && this.scrollableY) {
                        this.verticalScrollRatioWhenGrabbing = this._verticalScrollRatio <= 0 ? 0 : 1;
                    }
                }
                this.emitScrollableEvent();
                if (fireUpdate) {
                    this.fireScrollEvent(userAction);
                }
            } else if (verticalAxisEnabled && y !== null) {
                this.updateDirectionY(y, this._y);
            }
        }
        if (this._isContainerAllowedForCorrection && userAction) {
            this.emitOverscrollEvent(this._grabbing(), false);
        }
        return null;
    }

    protected emitScrollableEvent() {
        if (!!this.cdkScrollable) {
            this.cdkScrollable.getElementRef()?.nativeElement?.dispatchEvent(SCROLL_EVENT);
        }
    }

    refreshCoordinate(x: number, y: number) {
        const scrollContent = this.scrollContent()?.nativeElement as HTMLDivElement;
        scrollContent.style.transform = matrix3d((this._inversion ? 1 : -1) * x * (this._horizontalAxisInvertion() ? -1 : 1) + this._startLayoutOffsetX,
            (this._inversion ? 1 : -1) * y + this._startLayoutOffsetY);
    }

    protected fireScrollEvent(userAction: boolean) {
        this._$scroll.next(userAction);
    }

    protected onDragStart() { }

    reset(x: number = 0, y: number = 0) {
        this.stopScrolling();
        this.move(x, y);
    }

    stopAnimation(...ids: Array<number>) {
        this._userActionDuringAnimation.set(false);
        if (!ids) {
            this._animatorX.stop();
            this._animatorY.stop();
            return;
        }
        for (const id of ids) {
            this._animatorX.stop(id);
            this._animatorY.stop(id);
        }
    }

    ngOnDestroy(): void {
        if (this._animatorX) {
            this._animatorX.dispose();
        }
        if (this._animatorY) {
            this._animatorY.dispose();
        }
    }
}