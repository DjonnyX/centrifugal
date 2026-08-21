import {
    Component, computed, inject, Injector, input, Signal, ViewChild,
} from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, debounceTime, delay, filter, fromEvent, map, of, race, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import {
    DEFAULT_ANIMATION_PARAMS, DEFAULT_SCROLLING_ONE_BY_ONE, DEFAULT_SNAP_TO_ITEM, DEFAULT_SNAP_TO_ITEM_ALIGN, DEFAULT_SNAPPING_DISTANCE,
} from '../../const';
import {
    ACCELERATION_SCALE, ANIMATION_DURATION, DURATION, FRICTION_FORCE, MASS, MAX_DIST, MAX_DURATION, MAX_ITERATIONS_FOR_AVERAGE_CALCULATIONS,
    MAX_VELOCITY_TIMESTAMP, MAX_VELOCITIES_LENGTH, OVERSCROLL_START_ITERATION, SCROLL_EVENT, SPEED_SCALE,
    MIN_ACCELERATION, MIN_DELTA, OVERSCROLL_EFFECT_TIME,
} from './const';
import { calculateDirection, matrix3d } from './utils';
import { NtBaseScrollView } from './base';
import { IAnimationParams } from '../../interfaces';
import { SnapToItemAligns } from '../../enums';
import { calculateVelocity } from './utils/calculate-velocity';
import {
    CONTROL_CONTAINER_SERVICE, Id, IScrollingSettings, SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO, SCROLL_VIEW_USER_INTERACTION_ENABLED, TextDirections,
    SnappingDistance, SnapToItemAlign, ScrollDirection,
} from '../../../common';
import { Animator, ANIMATOR_MIN_TIMESTAMP, easeOutQuad, Easing, isPercentageValue, parseFloatOrPersentageValue } from '../../../common/utils';
import { INtControlContainerService } from '../../../control-container/interfaces';
import { MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, TOUCH_END, TOUCH_MOVE, TOUCH_START, WHEEL, } from '../../../common/const/event-names';
import { INTERACTIVE } from '../../../common/const/class-names';
import { IListScrollToParams } from '../../../common/interfaces/list-scroll-to-params';
import { LEFT_PROP_NAME, TOP_PROP_NAME, X_PROP_NAME, Y_PROP_NAME } from '../../../common/const/base-prop-names';
import { getScrollable } from '../../../common/utils/get-scrollable';
import { ScrollerTypes } from '../../../common/enums/scroller-types';
import { ICancelOverscrollOptions } from '../../../common/interfaces/cancel-overscroll-options';
import { IAnimatorUpdateData } from '../../../common/utils/animator/interfaces';
import { OverscrollEvent } from '../../../common/events/overscroll-event';
import { transitionExponent } from '../../../common/utils/transitions';
import { DEFAULT_TRANSITION_EXPONENT } from '../../../common/const/transitions';
import { BEHAVIOR_AUTO, BEHAVIOR_INSTANT, BEHAVIOR_SMOOTH } from '../../../common/const/behavior';
import { DEFAULT_OVERSCROLL_ENABLED, DEFAULT_SCROLL_BEHAVIOR, DEFAULT_SCROLLING_SETTINGS } from '../../../common/const/scroller';

/**
 * NtScrollView
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/components/nt-scroll-view/nt-scroll-view.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-scroll-view',
    template: '',
})
export class NtScrollView extends NtBaseScrollView {
    @ViewChild('scrollViewport', { read: CdkScrollable })
    readonly cdkScrollable: CdkScrollable | undefined;

    protected _controlContainerService = inject<INtControlContainerService>(CONTROL_CONTAINER_SERVICE);

    readonly scrollBehavior = input<ScrollBehavior>(DEFAULT_SCROLL_BEHAVIOR);

    readonly overscrollEnabled = input<boolean>(DEFAULT_OVERSCROLL_ENABLED);

    readonly scrollingSettings = input<IScrollingSettings>(DEFAULT_SCROLLING_SETTINGS);

    readonly snapToItem = input<boolean>(DEFAULT_SNAP_TO_ITEM);

    readonly scrollingOneByOne = input<boolean>(DEFAULT_SCROLLING_ONE_BY_ONE);

    readonly snapToItemAlign = input<SnapToItemAlign>(DEFAULT_SNAP_TO_ITEM_ALIGN);

    readonly snappingDistance = input<SnappingDistance>(DEFAULT_SNAPPING_DISTANCE);

    readonly animationParams = input<IAnimationParams>(DEFAULT_ANIMATION_PARAMS);

    protected _normalizeValueFromZero = inject(SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO);

    protected _userInteraction = inject(SCROLL_VIEW_USER_INTERACTION_ENABLED);

    protected _isScrollsTo: boolean = false;

    protected _$scrollDirection = new BehaviorSubject<ScrollDirection>(0);
    readonly $scrollDirection = this._$scrollDirection.asObservable();
    set scrollDirection(v: ScrollDirection) {
        this._$scrollDirection.next(v);
    }
    get scrollDirection() {
        return this._$scrollDirection.getValue();
    }

    protected _$wheel = new Subject<number>();
    readonly $wheel = this._$wheel.asObservable();

    protected _$scroll = new Subject<boolean>();
    readonly $scroll = this._$scroll.asObservable();

    protected _$scrollEnd = new Subject<boolean>();
    readonly $scrollEnd = this._$scrollEnd.asObservable();

    protected _velocities: Array<number> = [];

    protected _$velocity = new BehaviorSubject<number>(0);
    protected $velocity = this._$velocity.asObservable();
    get velocity() { return this._$velocity.getValue(); }

    protected _$averageVelocity = new BehaviorSubject<number>(0);
    protected $averageVelocity = this._$averageVelocity.asObservable();
    get averageVelocity() { return this._$averageVelocity.getValue(); }

    private _measureVelocityTimestamp: number = Date.now();

    private _measureVelocityLastPosition: number = this.isVertical() ? this._y : this._x;

    private _startPositionX = 0;

    private _startPositionY = 0;

    private _touchId = -1;

    set startPosition(v: number) {
        const isVertical = this.isVertical(),
            c = isVertical ? this._startPositionY : this._startPositionX;
        if (v !== c) {
            if (isVertical) {
                this._startPositionY = v;
            } else {
                this._startPositionX = v;
            }
        }
    }

    get startPosition() {
        if (this.isVertical()) {
            return this._startPositionY;
        }
        return this._startPositionX;
    }

    protected _animator = new Animator();

    protected _interactive = true;

    protected _horizontalAxisInvertion: Signal<boolean>;

    protected _scrollRatio: number = 0;
    get scrollRatio() { return this._scrollRatio; }

    protected _scrollRatioWhenGrabbing: number = 0;
    get scrollRatioWhenGrabbing() { return this._scrollRatioWhenGrabbing; }

    get inverted() { return this._horizontalAxisInvertion(); }

    private _overscrollIteration: number = 0;

    private _overscrollStartIteration = 0;

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

            this.updateDirection(x, this._y);

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

            this.updateDirection(y, this._y);

            this.refreshCoordinate(this._x, this._y);

            this.measureVelocity();

            if (snap) {
                this.checkIntersectionComponent();
            }
        }
    }

    protected _delta: number = 0;
    set delta(v: number) {
        this._delta = v;
        this.startPosition += v;
    }

    override set startLayoutOffset(v: number) {
        if (this._startLayoutOffset !== v) {
            this._startLayoutOffset = v;

            this.refreshCoordinate(this._x, this._y);
        }
    }
    override get startLayoutOffset() { return this._startLayoutOffset; }

    private _scrollDirectionValueX: number = 0;

    private _scrollDirectionValueY: number = 0;

    private _dragX: number = 0;

    private _dragY: number = 0;

    private _userScrollDirectionIsHorizontal: boolean = false;

    protected _intersectionComponentId: Id | null = null;

    protected _isAlignmentAnimation = false;

    get animated() { return this._animator?.isAnimated ?? false; }

    protected _injector = inject(Injector);

    constructor() {
        super();

        let mouseCanceled = false,
            touchCanceled = false;

        this._horizontalAxisInvertion = computed(() => {
            const isVertical = this.isVertical(), langTextDir = this.langTextDir();
            return !isVertical && langTextDir === TextDirections.RTL;
        });

        const $isVertical = toObservable(this.isVertical),
            $viewportBounds = toObservable(this.viewportBounds),
            $contentBounds = toObservable(this.contentBounds),
            $overscroll = this.$overscroll;

        $overscroll.pipe(
            takeUntilDestroyed(),
            tap(e => {
                this._$overscrollEffectEvent.next(e);
            }),
        ).subscribe();

        combineLatest([$isVertical, $viewportBounds, $contentBounds]).pipe(
            takeUntilDestroyed(),
            tap(([isVertical]) => {
                this._service.scrollable = { x: !isVertical && this.scrollable, y: isVertical && this.scrollable };
            }),
        ).subscribe();

        if (this._userInteraction) {
            const root = this._controlContainerService?.emitter ?? window;

            const $wheel = this.$wheel;
            $wheel.pipe(
                takeUntilDestroyed(),
                switchMap(v => of(this.averageVelocity)),
                debounceTime(100),
                tap(v => {
                    this._isMoving = false;
                    this._grabbing.set(false);
                    this._dragX = this._dragY = this._scrollRatioWhenGrabbing = 0;
                    this.snapWithInitialForceIfNecessary(v);
                    this._overscrollIteration = this._overscrollStartIteration = 0;
                    if (!!this._service) {
                        this._service.overscroll = { x: false, y: false };
                    }
                    this.scrollDirection = 0;
                    this._scrollDirectionValueX = this._scrollDirectionValueY = 0;
                    this.emitOverscrollEvent(false);
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
            ), $wheelEmitter = this._inversion ? $viewport : $content;

            if (!!this._controlContainerService) {
                this._controlContainerService.$focusEcho.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    filter(v => !!v),
                    tap(e => {
                        if (e.serviceId === this._service.id && this._type === ScrollerTypes.LIST_SCROLLER) {
                            this._controlContainerService.focus({ element: e.element, ngControl: e.ngControl, scroller: this, type: this._type, id: e.serviceId });
                        }
                    }),
                ).subscribe();
            }

            $wheelEmitter.pipe(
                takeUntilDestroyed(this._destroyRef),
                switchMap(content => {
                    return fromEvent<WheelEvent>(content, WHEEL, { passive: false }).pipe(
                        filter(() => this._interactive),
                        takeUntilDestroyed(this._destroyRef),
                        tap(e => {
                            const isVertical = this.isVertical();
                            this.emitScrollableEvent();
                            this.stopScrolling(true);
                            const scrollSize = isVertical ? this.scrollHeight : this.scrollWidth,
                                startPos = isVertical ? this._y : this._x,
                                delta = isVertical ? e.deltaY : (e.deltaX * (this._horizontalAxisInvertion() ? -1 : 1)), dp = (startPos + delta),
                                dragX = !isVertical ? delta : 0,
                                dragY = isVertical ? delta : 0;
                            this._dragX += !isVertical && this.scrollable && (this._x <= 0 || this._x >= this.scrollWidth) ? Math.abs(dragX) : 0;
                            this._dragY += isVertical && this.scrollable && (this._y <= 0 || this._y >= this.scrollHeight) ? Math.abs(dragY) : 0;
                            this._scrollRatioWhenGrabbing = Math.sign(-dragX) < 0 ? 1 : 0;
                            this.checkOverscroll(e, true);
                            const position = this.isInfinity() ? dp : (dp < 0 ? 0 : dp > scrollSize ? scrollSize : dp);
                            this.scroll({ [isVertical ? TOP_PROP_NAME : LEFT_PROP_NAME]: position, behavior: BEHAVIOR_INSTANT, userAction: true, blending: false, fireUpdate: true });
                            this._$wheel.next(delta);
                        }),
                    );
                }),
            ).subscribe();

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
                switchMap(content => {
                    return fromEvent<MouseEvent>(content, MOUSE_DOWN, { passive: false }).pipe(
                        takeUntilDestroyed(this._destroyRef),
                        filter(() => this._interactive),
                        switchMap(e => {
                            return race([fromEvent<MouseEvent>(root, MOUSE_UP, { passive: false }), fromEvent<MouseEvent>(content, MOUSE_UP, { passive: false })]).pipe(
                                takeUntilDestroyed(this._destroyRef),
                                takeUntil(fromEvent<MouseEvent>(root, MOUSE_MOVE, { passive: false })),
                                tap(e => {
                                    this._isMoving = false;
                                    this._grabbing.set(false);
                                    if (!mouseCanceled) {
                                        this.stopMoving();
                                    }
                                    mouseCanceled = true;
                                    this.cancelOverscroll({ event: e, released: true });
                                    if (this.snapToItem() || this.scrollingOneByOne()) {
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
                switchMap(content => {
                    return fromEvent<MouseEvent>(content, MOUSE_DOWN, { passive: false }).pipe(
                        takeUntilDestroyed(this._destroyRef),
                        filter(v => this._interactive),
                        switchMap(e => {
                            mouseCanceled = false;
                            this._overscrollStartIteration = 0;
                            this._service.overscroll = { x: false, y: false };
                            this.scrollDirection = 0;
                            this._scrollDirectionValueX = this._scrollDirectionValueY = 0;
                            this.cancelOverscroll();
                            this.onDragStart();
                            this.stopScrolling(true);
                            this.stopMoving();
                            const target = e.target as HTMLElement;
                            if (target.classList.contains(INTERACTIVE)) {
                                return of(undefined);
                            }
                            const inversion = this._inversion, isVertical = this.isVertical();
                            this._isMoving = true;
                            this._grabbing.set(true);
                            this._startPositionX = this.x;
                            this._startPositionY = this.y;
                            this._touchId = -1;
                            let prevClientPositionX: number | null = (e.clientX) * (this._horizontalAxisInvertion() ? -1 : 1),
                                prevClientPositionY: number | null = e.clientY,
                                startClientPosX = prevClientPositionX,
                                startClientPosY = prevClientPositionY,
                                offsetsX = new Array<[number, number]>(),
                                offsetsY = new Array<[number, number]>(),
                                velocitiesX = new Array<[number, number]>(),
                                velocitiesY = new Array<[number, number]>(),
                                startTime = Date.now();
                            return fromEvent<MouseEvent>(root, MOUSE_MOVE, { passive: false }).pipe(
                                takeUntilDestroyed(this._destroyRef),
                                takeUntil($mouseDragCancel),
                                switchMap(e => {
                                    const { position: positionX, currentPos: currentPosX, endTime, scrollDelta: scrollDeltaX } =
                                        this.calculatePosition(false, true, this._horizontalAxisInvertion(), e, inversion, startClientPosX, startTime, prevClientPositionX, offsetsX, velocitiesX),
                                        { position: positionY, currentPos: currentPosY, scrollDelta: scrollDeltaY } =
                                            this.calculatePosition(true, true, false, e, inversion, startClientPosY, startTime, prevClientPositionY, offsetsY, velocitiesY),
                                        position = isVertical ? positionY : positionX;
                                    prevClientPositionX = currentPosX;
                                    prevClientPositionY = currentPosY;
                                    this._scrollDirectionValueX += Math.abs(scrollDeltaX);
                                    this._scrollDirectionValueY += Math.abs(scrollDeltaY);
                                    const dx = (currentPosX ?? 0) - startClientPosX,
                                        dy = (currentPosY ?? 0) - startClientPosY,
                                        dragX = this._inversion ? (dx >= 0 ? (dx - this.scrollWidth + this._startPositionX) : (dx + this._startPositionX)) : (dx >= 0 ? (dx - this._startPositionX) : (dx - (this._startPositionX - this.scrollWidth))),
                                        dragY = this._inversion ? (dy >= 0 ? (dy - this.scrollHeight + this._startPositionY) : (dy + this._startPositionY)) : (dy >= 0 ? (dy - this._startPositionY) : (dy - (this._startPositionY - this.scrollHeight)));
                                    this._dragX = !isVertical && this.scrollable ? Math.abs(dragX) : 0;
                                    this._dragY = isVertical && this.scrollable ? Math.abs(dragY) : 0;
                                    this._scrollRatioWhenGrabbing = isVertical ? (Math.sign(dragY) < 0 ? 1 : 0) : (Math.sign(dragX) < 0 ? 1 : 0);
                                    this.checkOverscroll(e);
                                    this.move(isVertical, position, true, true, true);
                                    if (this.isInfinity()) {
                                        const offset = Math.abs(position) - Math.abs(isVertical ? this._y : this._x),
                                            scrollSize = isVertical ? this.scrollHeight : this.scrollWidth,
                                            viewportSize = isVertical ? this.viewportBounds().height : this.viewportBounds().width;
                                        if (position >= (scrollSize - viewportSize * .5) || position <= 0) {
                                            if (isVertical) {
                                                startClientPosY -= offset;
                                            } else {
                                                startClientPosX -= offset;
                                            }
                                        }
                                    }
                                    startTime = endTime;
                                    return race([fromEvent<MouseEvent>(root, MOUSE_UP, { passive: false }), fromEvent<MouseEvent>(content, MOUSE_UP, { passive: false })]).pipe(
                                        takeUntilDestroyed(this._destroyRef),
                                        takeUntil($mouseDragCancel),
                                        tap(e => {
                                            mouseCanceled = true;
                                            const endTime = Date.now(),
                                                timestamp = endTime - startTime,
                                                { v0 } = this.calculateVelocity(isVertical ? offsetsY : offsetsX, isVertical ? scrollDeltaY : scrollDeltaX, timestamp),
                                                { a0 } = this.calculateAcceleration(isVertical ? velocitiesY : velocitiesX, v0, timestamp);
                                            this._isMoving = false;
                                            this._grabbing.set(false);
                                            this.cancelOverscroll({ event: e, released: true });
                                            if (!this.snapIfNecessary(v0, false) && this.scrollBehavior() !== BEHAVIOR_INSTANT) {
                                                this.moveWithAcceleration(isVertical, position, 0, v0, a0, timestamp);
                                            } else {
                                                if (!this.snapIfNecessary(v0)) {
                                                    this.move(isVertical, position, false, true, true);
                                                }
                                                this._$scrollEnd.next(true);
                                            }
                                        }),
                                    );
                                }),
                            );
                        })
                    );
                }),
            ).subscribe();

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
            ), $touchMove = fromEvent<TouchEvent>(root, TOUCH_MOVE, { passive: false }).pipe(
                takeUntilDestroyed(this._destroyRef),
            ),
                $touchCanceler = race([$touchUp.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    filter(e => Array.from(e.targetTouches).findIndex(({ identifier }) => identifier === this._touchId) === -1),
                    delay(0),
                    tap(e => {
                        this._touchId = -1;
                        this._isMoving = false;
                        this._grabbing.set(false);
                        if (!touchCanceled) {
                            this.stopMoving();
                        }
                        touchCanceled = true;
                        this.cancelOverscroll({ event: e, released: true });
                        if (this.snapToItem() && this.scrollingOneByOne()) {
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
                switchMap(content => {
                    return fromEvent<TouchEvent>(content, TOUCH_START, { passive: false }).pipe(
                        takeUntilDestroyed(this._destroyRef),
                        filter(() => this._interactive),
                        switchMap(e => {
                            return race([fromEvent<TouchEvent>(root, TOUCH_END, { passive: false }), fromEvent<TouchEvent>(content, TOUCH_END, { passive: false })]).pipe(
                                takeUntilDestroyed(this._destroyRef),
                                takeUntil(fromEvent<TouchEvent>(root, TOUCH_MOVE, { passive: false })),
                                tap(e => {
                                    this._touchId = -1;
                                    this._isMoving = false;
                                    this._grabbing.set(false);
                                    if (!touchCanceled) {
                                        this.stopMoving();
                                    }
                                    touchCanceled = true;
                                    this.cancelOverscroll({ event: e, released: true });
                                    if (this.snapToItem() || this.scrollingOneByOne()) {
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
                switchMap(content => {
                    return fromEvent<TouchEvent>(content, TOUCH_START, { passive: false }).pipe(
                        takeUntilDestroyed(this._destroyRef),
                        filter(() => this._interactive),
                        switchMap(e => {
                            touchCanceled = false;
                            this._overscrollStartIteration = 0;
                            this._service.overscroll = { x: false, y: false };
                            this.scrollDirection = 0;
                            this._scrollDirectionValueX = this._scrollDirectionValueY = 0;
                            this.cancelOverscroll();
                            this.onDragStart();
                            this.stopScrolling(true);
                            this.stopMoving();
                            const target = e.target as HTMLElement;
                            if (target.classList.contains(INTERACTIVE)) {
                                return of(undefined);
                            }
                            const inversion = this._inversion, isVertical = this.isVertical(),
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
                                startTime = Date.now();
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
                                    const { position: positionX, currentPos: currentPosX, endTime, scrollDelta: scrollDeltaX } =
                                        this.calculatePosition(false, true, this._horizontalAxisInvertion(), e, inversion, startClientPosX, startTime, prevClientPositionX, offsetsX, velocitiesX, this._touchId),
                                        { position: positionY, currentPos: currentPosY, scrollDelta: scrollDeltaY } =
                                            this.calculatePosition(true, true, false, e, inversion, startClientPosY, startTime, prevClientPositionY, offsetsY, velocitiesY, this._touchId),
                                        position = isVertical ? positionY : positionX;
                                    prevClientPositionX = currentPosX;
                                    prevClientPositionY = currentPosY;
                                    this._scrollDirectionValueX += Math.abs(scrollDeltaX);
                                    this._scrollDirectionValueY += Math.abs(scrollDeltaY);
                                    const dx = (currentPosX ?? 0) - startClientPosX,
                                        dy = (currentPosY ?? 0) - startClientPosY,
                                        dragX = this._inversion ? (dx >= 0 ? (dx - this.scrollWidth + this._startPositionX) : (dx + this._startPositionX)) : (dx >= 0 ? (dx - this._startPositionX) : (dx - (this._startPositionX - this.scrollWidth))),
                                        dragY = this._inversion ? (dy >= 0 ? (dy - this.scrollHeight + this._startPositionY) : (dy + this._startPositionY)) : (dy >= 0 ? (dy - this._startPositionY) : (dy - (this._startPositionY - this.scrollHeight)));
                                    this._dragX = !isVertical && this.scrollable ? Math.abs(dragX) : 0;
                                    this._dragY = isVertical && this.scrollable ? Math.abs(dragY) : 0;
                                    this._scrollRatioWhenGrabbing = isVertical ? (Math.sign(dragY) < 0 ? 1 : 0) : (Math.sign(dragX) < 0 ? 1 : 0);
                                    this.checkOverscroll(e);
                                    this.move(isVertical, position, true, true, true);
                                    if (this.isInfinity()) {
                                        const offset = Math.abs(position) - Math.abs(isVertical ? this._y : this._x),
                                            scrollSize = isVertical ? this.scrollHeight : this.scrollWidth,
                                            viewportSize = isVertical ? this.viewportBounds().height : this.viewportBounds().width;
                                        if (position >= (scrollSize - viewportSize * .5) || position <= 0) {
                                            if (isVertical) {
                                                startClientPosY -= offset;
                                            } else {
                                                startClientPosX -= offset;
                                            }
                                        }
                                    }
                                    startTime = endTime;
                                    return race([fromEvent<TouchEvent>(root, TOUCH_END, { passive: false }), fromEvent<TouchEvent>(content, TOUCH_END, { passive: false })]).pipe(
                                        takeUntilDestroyed(this._destroyRef),
                                        takeUntil($touchCanceler),
                                        tap(e => {
                                            this._touchId = -1;
                                            touchCanceled = true;
                                            const endTime = Date.now(),
                                                timestamp = endTime - startTime,
                                                { v0 } = this.calculateVelocity(isVertical ? offsetsY : offsetsX, isVertical ? scrollDeltaY : scrollDeltaX, timestamp),
                                                { a0 } = this.calculateAcceleration(isVertical ? velocitiesY : velocitiesX, v0, timestamp);
                                            this._isMoving = false;
                                            this._grabbing.set(false);
                                            this.cancelOverscroll({ event: e, released: true });
                                            if (!this.snapIfNecessary(v0, false) && this.scrollBehavior() !== BEHAVIOR_INSTANT) {
                                                this.moveWithAcceleration(isVertical, position, 0, v0, a0, timestamp);
                                            } else {
                                                if (!this.snapIfNecessary(v0)) {
                                                    this.move(isVertical, position, false, true, true);
                                                }
                                                this._$scrollEnd.next(true);
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

    hasAnimation(id: number = -1) { return this._animator?.hasAnimation(id) ?? false; }

    protected updateDirection(position: number, prePosition: number) {
        const delta = (position - this._delta) - prePosition;
        this.scrollDirection = Math.sign(delta) as ScrollDirection;
    }

    protected override overrideCoordinates(x: number, y: number) {
        super.overrideCoordinates(x, y);
        const position = Math.abs(this.isVertical() ? y : x);
        this._measureVelocityTimestamp = Date.now();
        this._measureVelocityLastPosition = position;
        this.refreshCoordinate(x, y);
    }

    protected measureVelocity() {
        const timestamp = Date.now();
        if (timestamp === this._measureVelocityTimestamp) {
            return;
        }
        const position = Math.abs(this.isVertical() ? this._y : this._x);
        if (!this.isInfinity()) {
            if (position <= 0 || position >= (this.isVertical() ? this.scrollHeight : this.scrollWidth)) {
                this._velocities = [0];
                this._$averageVelocity.next(0);
                this._measureVelocityLastPosition = position;
                this._measureVelocityTimestamp = timestamp;
                return;
            }
        }
        if (this._delta !== 0) {
            return;
        }
        const timeDelta = timestamp - this._measureVelocityTimestamp,
            positionDelta = Math.abs(position - this._measureVelocityLastPosition),
            velocity = timeDelta > 0 ? positionDelta / timeDelta : 0;
        let avgVelocity = this._velocities.length > 0 ? this._velocities.reduce((p, c) => p + c) : 0;
        if (this._velocities.length >= MAX_ITERATIONS_FOR_AVERAGE_CALCULATIONS) {
            this._velocities.shift();
        }
        avgVelocity += velocity;
        this._$velocity.next(velocity);
        this._velocities.push(velocity);
        this._$averageVelocity.next(avgVelocity / MAX_ITERATIONS_FOR_AVERAGE_CALCULATIONS);
        this._measureVelocityLastPosition = position;
        this._measureVelocityTimestamp = timestamp;
    }

    protected stopMoving() { }

    private snapIfNecessary(v0: number, withInitialForce: boolean = true, animated: boolean = true, force: boolean = false) {
        const scrollDirection = this.scrollDirection || (force ? 1 : 0);
        if (scrollDirection === 0) {
            return false;
        }
        const snapToItem = this.snapToItem();
        if (!!snapToItem) {
            const scrollingOneByOne = this.scrollingOneByOne();
            if (scrollingOneByOne) {
                return this.alignPosition();
            }
            if (withInitialForce) {
                return this.snapWithInitialForceIfNecessary(v0, animated, force);
            }
        }
        return false;
    }

    protected snapWithInitialForceIfNecessary(v0: number | null = null, animated = true, force: boolean = false, fireUpdate: boolean = true) {
        const t = this.animationParams().snapToItem * this.scrollingSettings().breakpointStoppingFactor!, s = this.getSnappedComponentSize(),
            va = s !== null && t !== 0 ? (s / t) : 0;
        if (va >= Math.abs(v0 ?? this.averageVelocity)) {
            return this.alignPosition(animated, force, fireUpdate);
        }
        return false;
    }

    private calculatePosition(isVertical: boolean, enabled: boolean, axisInversion: boolean, e: MouseEvent | TouchEvent | any, inversion: boolean, startClientPos: number, startTime: number,
        prevClientPosition: number | null, offsets: Array<[number, number]>, velocities: Array<[number, number]>, touchId: number = 0,
    ) {
        if (!enabled) {
            return { position: isVertical ? this._y : this._x, currentPos: null, endTime: Date.now(), scrollDelta: 0 };
        }
        const coord = (isVertical ? !!e.targetTouches ? Array.from((e as TouchEvent).targetTouches)?.find(({ identifier }) => identifier === touchId)?.clientY : e.clientY :
            !!e.targetTouches ? Array.from((e as TouchEvent).targetTouches)?.find(({ identifier }) => identifier === touchId)?.clientX : e.clientX),
            currentPos = coord * (axisInversion ? -1 : 1),
            scrollSize = isVertical ? this.scrollHeight : this.scrollWidth, delta = (inversion ? -1 : 1) * (startClientPos - currentPos),
            dp = (isVertical ? this._startPositionY : this._startPositionX) + delta, position = this.isInfinity() ? dp : dp < 0 ? 0 : dp > scrollSize ? scrollSize : dp,
            endTime = Date.now(), timestamp = endTime - startTime, scrollDelta = (prevClientPosition === 0 || prevClientPosition === null) ? 0 : prevClientPosition - currentPos,
            { v0 } = this.calculateVelocity(offsets, scrollDelta, timestamp);
        this.calculateAcceleration(velocities, v0, timestamp);

        return { position, currentPos, endTime, scrollDelta };
    }

    private cancelOverscroll(options?: ICancelOverscrollOptions) {
        if (options?.released && !this._service.overscroll.x && !this._service.overscroll.y && !!this._controlContainerService) {
            this._controlContainerService.overscrollCancel({
                element: (options?.event?.target as HTMLElement) ?? this._elementRef.nativeElement,
                ngControl: null, scroller: this, type: this._type!, id: this._service.id,
            });
        }
        this._overscrollIteration = this._dragX = this._dragY = 0;
        this.emitOverscrollEvent(false, !this.overscrollEnabled());
    }

    private checkOverscrollByAxis(e: Event, pos: number, limit: number) {
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
        const overscrollX = this._service.overscroll.x,
            overscrollY = this._service.overscroll.y;
        this._userScrollDirectionIsHorizontal = this._scrollDirectionValueX > this._scrollDirectionValueY;
        if (this._userScrollDirectionIsHorizontal) {
            const scrollable = getScrollable(this._service, X_PROP_NAME, true);
            if (!overscrollY && scrollable) {
                if (this._overscrollStartIteration < OVERSCROLL_START_ITERATION) {
                    this._overscrollStartIteration++;
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
                if (!this.isInfinity()) {
                    const p = Math.abs(this._x);
                    if (p <= 0 || p >= this.scrollWidth) {
                        this.emitOverscrollEvent();
                    }
                }
            }
        } else {
            const scrollable = getScrollable(this._service, Y_PROP_NAME, true);
            if (!overscrollX && scrollable) {
                if (this._overscrollStartIteration < OVERSCROLL_START_ITERATION) {
                    this._overscrollStartIteration++;
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
                if (!this.isInfinity()) {
                    const p = Math.abs(this._y);
                    if (p <= 0 || p >= this.scrollHeight) {
                        this.emitOverscrollEvent();
                    }
                }
            }
        }
    }

    private createOverflowEvent(grabbing: boolean, exp: number = DEFAULT_TRANSITION_EXPONENT) {
        const bounds = this.viewportBounds(), isVertical = this.isVertical(), event = new OverscrollEvent({
            grabbing,
            dragX: transitionExponent(this.scrollRatio <= 0 || this.scrollRatio >= 1 ? this._dragX : 0, bounds.width, exp),
            dragY: transitionExponent(this.scrollRatio <= 0 || this.scrollRatio >= 1 ? this._dragY : 0, bounds.height, exp),
            positionX: (isVertical ? 0 : (this.langTextDir() === TextDirections.LTR ? (this._scrollRatioWhenGrabbing === 1 ? 1 : 0) : (this._scrollRatioWhenGrabbing === 1 ? 0 : 1))),
            positionY: (isVertical ? (this._scrollRatioWhenGrabbing === 1 ? 1 : 0) : 0),
        });
        return event;
    }

    protected emitOverscrollEffectEvent(grabbing: boolean = true, exp: number = DEFAULT_TRANSITION_EXPONENT) {
        const event = this.createOverflowEvent(grabbing, exp);
        this._$overscrollEffectEvent.next(event);
    }

    protected emitOverscrollEvent(grabbing: boolean = true, output: boolean = true, exp: number = DEFAULT_TRANSITION_EXPONENT) {
        if (this.isInfinity()) {
            return;
        }
        const event = this.createOverflowEvent(grabbing, exp);
        this._$overscroll.next(event);
        if (output) {
            this.onOverscroll.emit(event);
        }
    }

    private calculateVelocity(offsets: Array<[number, number]>, delta: number, timestamp: number, indexOffset: number = 10) {
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

    private calculateAcceleration(velocities: Array<[number, number]>, delta: number, timestamp: number, indexOffset: number = 10) {
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

    override stopScrolling(force: boolean = false) {
        if (this._isAlignmentAnimation && !force) {
            return;
        }
        this._isAlignmentAnimation = false;
        this._animator.stop();
    }

    protected move(isVertical: boolean, position: number, blending: boolean = false, userAction: boolean = false, fireUpdate: boolean = true) {
        this.scroll({ [isVertical ? TOP_PROP_NAME : LEFT_PROP_NAME]: position, behavior: BEHAVIOR_INSTANT, blending, userAction, fireUpdate });
    }

    protected moveWithAcceleration(isVertical: boolean, position: number, v0: number, v: number, a0: number, timestamp: number) {
        if (a0 !== 0 && timestamp < MAX_VELOCITY_TIMESTAMP) {
            const dvSign = Math.sign(v) || 1,
                mass = this.scrollingSettings()?.mass ?? MASS,
                duration = DURATION, maxDuration = this.scrollingSettings()?.maxDuration ?? MAX_DURATION,
                maxDist = this.scrollingSettings()?.maxDistance ?? MAX_DIST,
                maxDistance = dvSign * maxDist, s = (dvSign * Math.abs((a0 * Math.pow(duration, 2)) * .5) / 10000) / mass,
                distance = Math.abs(s) < maxDist ? s : maxDistance, positionWithVelocity = position + (this._inversion ? -1 : 1) * distance,
                ad = Math.abs(a0 !== 0 ? Math.sqrt(a0) : 0) * ACCELERATION_SCALE / mass,
                aDuration = ad < maxDuration ? ad : maxDuration,
                startPosition = isVertical ? this.y : this.x;
            this.animate(startPosition, Math.round(positionWithVelocity), aDuration, easeOutQuad, false, true);
        } else {
            this.alignPosition(true, true);
        }
    }

    protected normalizeValue(value: number) {
        if (this.isInfinity()) {
            return value;
        }
        const isVertical = this.isVertical(),
            startOffset = this._normalizeValueFromZero ? 0 : this.startOffset(),
            scrollSize = this.scrollable ? ((isVertical ? this.scrollHeight : this.scrollWidth) - this.alignmentEndOffset()) : 0,
            result = this.scrollable ? (value <= startOffset ? startOffset : value > scrollSize ? scrollSize : value) : startOffset;
        return result;
    }

    protected override normalizeScrollSize() {
        const result = super.normalizeScrollSize();
        this.scrollLimits();
        return result;
    }

    protected animate(startValue: number, endValue: number, duration = ANIMATION_DURATION, easingFunction: Easing = easeOutQuad, blending: boolean = false,
        userAction: boolean = false, alignmentAtComplete: boolean = true, skipOverridedCoordinates: boolean = false, fireUpdate: boolean = true,
        onUpdate: ((data: IAnimatorUpdateData) => void) | null = null, onComplete: ((data: IAnimatorUpdateData) => void) | null = null): number {
        const isVertical = this.isVertical();
        let position = startValue;
        this._isAlignmentAnimation = !alignmentAtComplete;

        if (this.hasAnimation() && blending) {
            const updatable = this._animator.updateTo(endValue);
            if (updatable) {
                return this._animator.id;
            }
        }

        let overflowTime: number | null = null, overscrollEffectCanceled = -1;
        return this._animator.animate({
            withDelta: this._service.dynamic && !this.isInfinity(),
            startValue,
            endValue,
            duration,
            easingFunction,
            getPropValue: () => {
                return isVertical ? this._y : this._x;
            }, onUpdate: data => {
                this._userActionDuringAnimation.set(userAction);
                const { value, timestamp, elapsed, complete } = data, time = Date.now(), scrollSize = (isVertical ? this.scrollHeight : this.scrollWidth);
                if (!overflowTime && (value <= 0 || value >= scrollSize)) {
                    overflowTime = Date.now();
                }
                if (!!overflowTime && ((time - overflowTime) < OVERSCROLL_EFFECT_TIME)) {
                    overscrollEffectCanceled = 0;
                    const dv = value,
                        scrollable = this.scrollable,
                        dragV = dv < 0 ? dv : (dv - scrollSize),
                        normalizedDrag = scrollable ? Math.abs(dragV) : 0,
                        dragSign = scrollable ? Math.sign(dragV) : 0,
                        pos = (this._inversion ? dragSign <= 0 : dragSign > 0) ? 1 : 0;
                    this._scrollRatioWhenGrabbing = pos;
                    if (isVertical) {
                        this._dragY = normalizedDrag;
                    } else {
                        this._dragX = normalizedDrag;
                    }
                    this.emitOverscrollEffectEvent(userAction);
                } else if (overscrollEffectCanceled === 0) {
                    overscrollEffectCanceled = 1;
                    complete();
                }

                if (this._isCoordinatesOverrided && !skipOverridedCoordinates) {
                    this._isCoordinatesOverrided = false;
                    const currentCoordinate = isVertical ? this._y : this._x, delta = endValue - value;
                    this.animate(currentCoordinate, currentCoordinate + delta, duration - elapsed, easingFunction, blending, userAction, alignmentAtComplete, false, true, onUpdate, onComplete);
                    return;
                }
                const v0 = calculateVelocity(position, value - this._delta, timestamp) ?? this.averageVelocity;
                position = value;
                if (alignmentAtComplete && !this._isAlignmentAnimation && !skipOverridedCoordinates) {
                    if (!this.snapIfNecessary(v0)) {
                        this.move(isVertical, value, false, userAction, fireUpdate);
                    }
                } else {
                    this.move(isVertical, value, false, userAction, fireUpdate);
                }
                this._service.update(true);
                if (typeof onUpdate === 'function') {
                    onUpdate(data);
                }
            }, onComplete: data => {
                this._userActionDuringAnimation.set(false);
                const { value, timestamp } = data;
                this._isAlignmentAnimation = false;
                overscrollEffectCanceled = 1;
                this._dragX = this._dragY = 0;
                this.emitOverscrollEffectEvent(false);
                const v0 = calculateVelocity(position, value, timestamp);
                if (alignmentAtComplete && !this._isAlignmentAnimation && !skipOverridedCoordinates) {
                    this.snapIfNecessary(v0);
                } else {
                    this.move(isVertical, value, false, userAction, fireUpdate);
                }
                this._$scrollEnd.next(userAction);
                this._service.update(true);
                this.onAnimationComplete(value);
                if (typeof onComplete === 'function') {
                    onComplete(data);
                }
            },
        });
    }

    protected getSnappedComponentSize() {
        const align = this.snapToItemAlign(), isVertical = this.isVertical(), sd = this.snappingDistance(),
            snappingDistance = parseFloatOrPersentageValue(sd),
            isPersentageSnappingDistance = isPercentageValue(sd);
        let size: number | null = null;
        const scrollDirection = this.scrollDirection,
            currentPosition = (isVertical ? this.scrollTop : this.scrollLeft) - this._startLayoutOffset,
            currentComponentBounds = this._service.getComponentBoundsByIntersectionPosition(currentPosition),
            currentComponentSize = isVertical ? currentComponentBounds?.height ?? 0 : currentComponentBounds?.width ?? 0;
        switch (align) {
            case SnapToItemAligns.START: {
                const offset = ((scrollDirection === 1 ? currentComponentSize : 0) - (isPersentageSnappingDistance ? currentComponentSize * snappingDistance : snappingDistance)) * scrollDirection,
                    componentBounds = this._service.getComponentBoundsByIntersectionPosition(currentPosition + offset);
                if (!!componentBounds) {
                    const { width, height } = componentBounds,
                        compSize = isVertical ? height : width;
                    size = compSize;
                }
                break;
            }
            case SnapToItemAligns.CENTER: {
                const viewportSize = isVertical ? this.viewportBounds().height : this.viewportBounds().width,
                    offset = (currentComponentSize * .5 - (isPersentageSnappingDistance ? currentComponentSize * snappingDistance : snappingDistance)) * scrollDirection,
                    actualPos = currentPosition + offset + viewportSize * .5,
                    maxPos = isVertical ? this.scrollHeight : this.scrollWidth,
                    pos = Math.min(actualPos, maxPos);
                const componentBounds = this._service.getComponentBoundsByIntersectionPosition(pos);
                if (!!componentBounds) {
                    const { width, height } = componentBounds,
                        compSize = isVertical ? height : width;
                    size = compSize;
                }
                break;
            }
            case SnapToItemAligns.END: {
                const viewportSize = isVertical ? this.viewportBounds().height : this.viewportBounds().width,
                    offset = ((scrollDirection === 1 ? currentComponentSize : 0) - (isPersentageSnappingDistance ? currentComponentSize * snappingDistance : snappingDistance)) * scrollDirection,
                    actualPos = currentPosition + offset + viewportSize,
                    maxPos = isVertical ? this.scrollHeight : this.scrollWidth,
                    pos = Math.min(actualPos, maxPos);
                const componentBounds = this._service.getComponentBoundsByIntersectionPosition(pos);
                if (!!componentBounds) {
                    const { width, height } = componentBounds,
                        compSize = isVertical ? height : width;
                    size = compSize;
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
        const scrollDirection = this.scrollDirection || (force ? 1 : 0);
        if (scrollDirection === 0) {
            return false;
        }
        const align = this.snapToItemAlign(), isVertical = this.isVertical(),
            viewportSize = isVertical ? this.viewportBounds().height : this.viewportBounds().width,
            sd = this.snappingDistance(),
            snappingDistance = parseFloatOrPersentageValue(sd),
            isPersentageSnappingDistance = isPercentageValue(sd);
        let position: number | null = null, size: number = 0;
        const currentPosition = (isVertical ? this.scrollTop : this.scrollLeft) - this._startLayoutOffset,
            currentComponentBounds = this._service.getComponentBoundsByIntersectionPosition(currentPosition),
            currentComponentSize = isVertical ? currentComponentBounds?.height ?? 0 : currentComponentBounds?.width ?? 0;
        switch (align) {
            case SnapToItemAligns.START: {
                const offset = ((scrollDirection === 1 ? currentComponentSize : 0) - (isPersentageSnappingDistance ? currentComponentSize * snappingDistance : snappingDistance)) * scrollDirection,
                    componentBounds = this._service.getComponentBoundsByIntersectionPosition(currentPosition + offset);
                if (!!componentBounds) {
                    const { x, y, width, height } = componentBounds, startOffset = this.startOffset(), alignmentStartOffset = this.alignmentStartOffset(),
                        componentPosition = isVertical ? y : x;
                    size = isVertical ? height : width;
                    const maxPos = (isVertical ? this.scrollHeight : this.scrollWidth) - (startOffset - alignmentStartOffset) + this._startLayoutOffset;
                    position = componentPosition - (startOffset - alignmentStartOffset) + this._startLayoutOffset;
                    if (this.isInfinity()) {
                        if (position < 0 || position > maxPos) {
                            position = maxPos;
                            if (isVertical) {
                                this._y = this.scrollHeight;
                            } else {
                                this._x = this.scrollWidth;
                            }
                        }
                    }
                }
                break;
            }
            case SnapToItemAligns.CENTER: {
                const offset = (currentComponentSize * .5 - (isPersentageSnappingDistance ? currentComponentSize * snappingDistance : snappingDistance)) * scrollDirection,
                    actualPos = currentPosition + offset + viewportSize * .5,
                    maxPos = isVertical ? this.scrollHeight : this.scrollWidth,
                    pos = Math.min(actualPos, maxPos);
                const componentBounds = this._service.getComponentBoundsByIntersectionPosition(pos);
                if (!!componentBounds) {
                    const { x, y, width, height } = componentBounds, startOffset = this.startOffset(), alignmentStartOffset = this.alignmentStartOffset(),
                        componentPosition = isVertical ? y : x;
                    size = isVertical ? height : width;
                    const maxPos = (isVertical ? this.scrollHeight : this.scrollWidth) - size * .5 - viewportSize * .5 - (startOffset - alignmentStartOffset) * .5;
                    position = componentPosition + size * .5 - viewportSize * .5 - (startOffset - alignmentStartOffset) * .5 + this._startLayoutOffset;
                    if (this.isInfinity()) {
                        if (position <= 0 || position > maxPos) {
                            position = maxPos;
                            if (isVertical) {
                                this._y = this.scrollHeight;
                            } else {
                                this._x = this.scrollWidth;
                            }
                        }
                    }
                }
                break;
            }
            case SnapToItemAligns.END: {
                const offset = ((scrollDirection === 1 ? currentComponentSize : 0) - (isPersentageSnappingDistance ? currentComponentSize * snappingDistance : snappingDistance)) * scrollDirection,
                    actualPos = currentPosition + offset + viewportSize,
                    maxPos = isVertical ? this.scrollHeight : this.scrollWidth,
                    pos = Math.min(actualPos, maxPos);
                const componentBounds = this._service.getComponentBoundsByIntersectionPosition(pos);
                if (!!componentBounds) {
                    const { x, y, width, height } = componentBounds,
                        componentPosition = isVertical ? y : x;
                    size = isVertical ? height : width;
                    position = componentPosition - viewportSize + this._startLayoutOffset;
                }
                break;
            }
        }

        const cPos = (isVertical ? this.scrollTop : this.scrollLeft);

        if (position !== null && position !== cPos) {
            this.stopScrolling(true);
            if (animated) {
                this.animate(cPos, position, this.animationParams().snapToItem, easeOutQuad, false, false, false, true, fireUpdate);
            } else {
                this.move(isVertical, position, false, false, true);
            }
            return true;
        }
        return false;
    }

    protected checkIntersectionComponent() {
        const align = this.snapToItemAlign(), isVertical = this.isVertical(),
            viewportSize = isVertical ? this.viewportBounds().height : this.viewportBounds().width;
        let componentId: Id | null = null;
        const currentPosition = (isVertical ? this.scrollTop : this.scrollLeft) - this._startLayoutOffset;
        switch (align) {
            case SnapToItemAligns.START: {
                const maxPos = isVertical ? this.scrollHeight : this.scrollWidth,
                    componentBounds = this._service.getComponentBoundsByIntersectionPosition(currentPosition, maxPos);
                if (!!componentBounds) {
                    const { id } = componentBounds;
                    componentId = id;
                }
                break;
            }
            case SnapToItemAligns.CENTER: {
                const actualPos = currentPosition + viewportSize * .5,
                    maxPos = isVertical ? this.scrollHeight : this.scrollWidth,
                    pos = Math.min(actualPos, maxPos);
                const componentBounds = this._service.getComponentBoundsByIntersectionPosition(pos, maxPos);
                if (!!componentBounds) {
                    const { id } = componentBounds;
                    componentId = id;
                }
                break;
            }
            case SnapToItemAligns.END: {
                const actualPos = currentPosition + viewportSize,
                    maxPos = isVertical ? this.scrollHeight : this.scrollWidth,
                    pos = Math.min(actualPos, maxPos);
                const componentBounds = this._service.getComponentBoundsByIntersectionPosition(pos, maxPos);
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

    protected onAnimationComplete(position: number) { }

    protected dropVelocity() {
        const position = Math.abs(this.isVertical() ? this._y : this._x);
        if (!this.isInfinity()) {
            this._velocities = [0];
            this._$averageVelocity.next(0);
            this._measureVelocityLastPosition = position;
            this._measureVelocityTimestamp = Date.now();
        }
    }

    fireScroll(userAction: boolean = false) {
        this._$updateScrollBar.next();
        this.emitScrollableEvent();
        this.fireScrollEvent(userAction);
    }

    scrollLimits(value?: number | undefined, silent: boolean = false): boolean {
        if (!this.isInfinity()) {
            const x = value !== undefined ? value : this._x, y = value !== undefined ? value : this._y, isVertical = this.isVertical();
            if (isVertical) {
                const yy = this.normalizeValue(y);
                if (y !== yy) {
                    if (silent) {
                        this._y = yy;
                        this.refreshCoordinate(this._x, this._y);
                    } else {
                        this.y = yy;
                    }
                    return true;
                }
            } else {
                const xx = this.normalizeValue(x);
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
        }
        return false;
    }

    protected resetDrag() {
        this._dragX = this._dragY = 0;
    }

    override scroll(params: IListScrollToParams) {
        const posX = params.x ?? params.left ?? null,
            posY = params.y ?? params.top ?? null,
            userAction = params.userAction ?? false,
            snap = params.snap ?? true,
            normalize = params.normalize ?? true,
            ease = params.ease || easeOutQuad,
            onUpdate = params.onUpdate ?? null,
            onComplete = params.onComplete ?? null,
            fireUpdate = params.fireUpdate ?? true,
            behavior = params.behavior ?? BEHAVIOR_INSTANT,
            blending = params.blending ?? true,
            force = params.force ?? false,
            duration = params.duration ?? ANIMATION_DURATION,
            isVertical = this.isVertical();

        const x = posX === null ? null : this.normalizeValue(posX),
            y = posY == null ? null : this.normalizeValue(posY),
            prevX = this._x,
            prevY = this._y;

        if (behavior === BEHAVIOR_AUTO || behavior === BEHAVIOR_SMOOTH) {
            if (isVertical) {
                if (y !== null && prevY !== y) {
                    return this.animate(prevY, y, duration, ease, blending, userAction, true, false, true, onUpdate, onComplete);
                }
            } else {
                if (x !== null && prevX !== x) {
                    return this.animate(prevX, x, duration, ease, blending, userAction, true, false, true, onUpdate, onComplete);
                }
            }
        } else {
            if (isVertical) {
                if (y !== null && (this._y !== y || force)) {
                    this.setY(y, snap, normalize);
                    if (userAction) {
                        const scrollHeight = Math.abs(this.scrollHeight),
                            yy = Math.abs(this._y);
                        this._scrollRatio = scrollHeight !== 0 ? yy / scrollHeight : 0;
                        this._scrollRatioWhenGrabbing = this._scrollRatio === 0 ? 0 : 1;
                    }
                    this.emitScrollableEvent();
                    if (fireUpdate) {
                        this.fireScrollEvent(userAction);
                    }
                }
            } else {
                if (x !== null && (this._x !== x || force)) {
                    this.setX(x, snap, normalize);
                    if (userAction) {
                        const scrollWidth = Math.abs(this.scrollWidth),
                            xx = Math.abs(this._x);
                        this._scrollRatio = scrollWidth !== 0 ? xx / scrollWidth : 0;
                        this._scrollRatioWhenGrabbing = this._scrollRatio === 0 ? 0 : 1;
                    }
                    this.emitScrollableEvent();
                    if (fireUpdate) {
                        this.fireScrollEvent(userAction);
                    }
                }
            }
        }
        const value = isVertical ? y : x;
        if (value !== null) {
            const delta = isVertical ? (y! - prevY) : (x! - prevX);
            if (onComplete !== null) {
                onComplete({
                    id: -1,
                    timestamp: 0,
                    elapsed: 0,
                    delta,
                    value,
                    complete: () => { },
                });
            }
        }
        this.emitOverscrollEvent(this._grabbing(), false);
        return -1;
    }

    protected emitScrollableEvent() {
        if (!!this.cdkScrollable) {
            this.cdkScrollable.getElementRef()?.nativeElement?.dispatchEvent(SCROLL_EVENT);
        }
    }

    refreshCoordinate(x: number, y: number) {
        const scrollContent = this.scrollContent()?.nativeElement as HTMLDivElement;
        scrollContent.style.transform = matrix3d((this._inversion ? 1 : -1) * x * (this._horizontalAxisInvertion() ? -1 : 1) + (this.isVertical() ? 0 : this._startLayoutOffset),
            (this._inversion ? 1 : -1) * y + (this.isVertical() ? this._startLayoutOffset : 0));
    }

    protected fireScrollEvent(userAction: boolean) {
        this._$scroll.next(userAction);
    }

    protected onDragStart() { }

    reset(offset: number = 0) {
        this.stopScrolling();
        this.move(this.isVertical(), offset);
    }

    stopAnimation(id: number) {
        this._userActionDuringAnimation.set(false);
        this._animator.stop(id);
    }

    ngOnDestroy(): void {
        if (this._animator) {
            this._animator.dispose();
        }
    }
}