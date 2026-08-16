import {
    ChangeDetectionStrategy, Component, computed, DestroyRef, effect, ElementRef, inject, Injector, input, output, Signal,
    signal, ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
    BehaviorSubject, combineLatest, debounceTime, delay, distinctUntilChanged, filter, map, Observable, of, startWith, Subject,
    switchMap, take, tap,
} from 'rxjs';
import {
    IAnimationParams, INtSheetService, INtSheetBreakpoints, ISheetPrecalculatedBreakpoints, ISheetPrecalculatedBreakpoint,
    INtSheetBreakpointInfo, INtSheetBreakpointEvent,
} from './interfaces';
import {
    Direction, SheetPosition,
} from './types';
import {
    SheetPositions,
} from './enums';
import { objectAsReadonly } from '../common/utils/object';
import {
    ArithmeticExpression, CONTROL_CONTAINER_SERVICE, Directions, Id, IScrollingSettings, IScrollOptions, IScrollViewScrollEvent, ISize, SCROLL_VIEW_OVERSCROLL_ENABLED,
    SCROLL_VIEW_SERVICE, SCROLL_VIEW_USER_INTERACTION_ENABLED, TextDirection, TextDirections,
} from '../common';
import { isDirection } from '../common/utils/is-direction';
import {
    isPercentageValue, parseArithmeticExpression, toggleClassName, validateArray, validateBoolean, validateFloat, validateInt, validateObject,
    validateString,
} from '../common/utils';
import { ScrollEvent } from '../common/utils/scroll-event';
import { DEFAULT_CLICK_DISTANCE } from '../common/directives/nt-control/const';
import { NtBaseScrollComponent } from '../common/components/nt-base-scroll-component';
import { BEHAVIOR_AUTO, BEHAVIOR_INSTANT } from '../common/const/behavior';
import {
    DEFAULT_LANG_TEXT_DIR, DEFAULT_MAX_MOTION_BLUR, DEFAULT_MOTION_BLUR, DEFAULT_MOTION_BLUR_ENABLED, DEFAULT_OVERSCROLL_ENABLED,
    DEFAULT_SCROLL_BEHAVIOR,
} from '../common/const/scroller';
import {
    CLASS_SHEET_HORIZONTAL, CLASS_SHEET_VERTICAL, DEFAULT_ANIMATION_PARAMS, DEFAULT_BREAKPOINT_TRIGGER_DISTANCE, DEFAULT_OPENING_BREAKPOINTS,
    DEFAULT_POSITION, DEFAULT_SCROLLING_SETTINGS, DEFAULT_SHEET_SIZE, DEFAULT_SNAPPING_DISTANCE,
} from './const';
import { NtSheetService } from './nt-sheet.service';
import { INtScrollViewService } from '../scroll-view';
import { DISPLAY_BLOCK, DISPLAY_NONE, HEIGHT_PROP_NAME, OPACITY_0, OPACITY_1, PX, WIDTH_PROP_NAME } from '../common/const/base-prop-names';
import { getBreakpointByPosition, NtSheetBreakpointEvent } from './utils';
import { NtScrollerComponent } from '../list/components/nt-scroller/nt-scroller.component';
import { SnappingDistance } from '../common/types/snapping-distance';

/**
 * NtSheetComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/nt-sheet.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-sheet',
    templateUrl: './nt-sheet.component.html',
    styleUrl: './nt-sheet.component.scss',
    host: {
        'style': 'position: absolute; display: none; width: 100%; height: 100%; left: 0; top: 0;'
    },
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.ShadowDom,
    providers: [
        { provide: SCROLL_VIEW_USER_INTERACTION_ENABLED, useValue: true },
        { provide: SCROLL_VIEW_OVERSCROLL_ENABLED, useValue: true },
        { provide: SCROLL_VIEW_SERVICE, useClass: NtSheetService },
    ],
})
export class NtSheetComponent<S extends INtSheetService, P extends INtScrollViewService>
    extends NtBaseScrollComponent<S, P, NtScrollerComponent> {

    protected _scroller: Signal<ElementRef<HTMLDivElement> | undefined>;

    /**
     * Fires when the list has been scrolled.
     */
    onScroll = output<IScrollViewScrollEvent>();

    /**
     * Fires when the list has completed scrolling.
     */
    onScrollEnd = output<IScrollViewScrollEvent>();

    /**
     * Fires when the viewport size is changed.
     */
    onViewportChange = output<ISize>();

    /**
     * Fires information about the breakpoint position.
     */
    onBreakpoint = output<INtSheetBreakpointEvent>();

    protected _$initialized = new BehaviorSubject<boolean>(false);
    readonly $initialized = this._$initialized.asObservable();

    protected _breakpointsOptions = {
        transform: (v: INtSheetBreakpoints) => {
            let valid = validateArray(v);
            if (!valid) {
                console.error('The "breakpoints" parameter must be of type `number`.');
                return DEFAULT_OPENING_BREAKPOINTS;
            }
            for (let i = 0, l = v.length; i < l; i++) {
                const pos = v[i];
                valid = validateObject(pos);
                if (!valid) {
                    console.error('The "breakpoint" parameter must be of type `ISheetBreakpoint`.');
                    return DEFAULT_OPENING_BREAKPOINTS;
                }
                valid = validateString(pos.id);
                if (!valid) {
                    console.error('The "breakpoint.id" parameter must be of type `string`.');
                    return DEFAULT_OPENING_BREAKPOINTS;
                }
                valid = validateFloat(pos.position as number) || (validateString(pos.position as string) && isPercentageValue(pos.position));
                if (!valid) {
                    console.error('The "breakpoint.position" parameter must be of type `number` or `ArithmeticExpression`.');
                    return DEFAULT_OPENING_BREAKPOINTS;
                }
            }
            return v;
        },
    } as any;

    /**
     * Opening breakpoints.
     */
    breakpoints = input<INtSheetBreakpoints>(DEFAULT_OPENING_BREAKPOINTS, { ...this._breakpointsOptions });

    protected _breakpointTriggerDistanceOptions = {
        transform: (v: number) => {
            let valid = validateFloat(v) && v >= 0 && v <= 1;
            if (!valid) {
                console.error('The "breakpointTriggerDistance" parameter must be of type `number` with a range from 0 to 1.');
                return DEFAULT_BREAKPOINT_TRIGGER_DISTANCE;
            }
            return v;
        },
    } as any;

    /**
     * Breakpoint trigger distance. Specified as a percentage from 0 to 1.
     */
    breakpointTriggerDistance = input<number>(DEFAULT_BREAKPOINT_TRIGGER_DISTANCE, { ...this._breakpointTriggerDistanceOptions });

    protected _snappingDistanceOptions = {
        transform: (v: SnappingDistance | any) => {
            const valid = validateString(v) || validateFloat(v);

            if (!valid) {
                console.error('The "snappingDistance" parameter must be of type `number` or `string`.');
                return DEFAULT_SNAPPING_DISTANCE;
            }
            return v;
        },
    } as any;

    /**
     * Snapping activation distance. Can be specified as a percentage of the element size or in absolute values.
     * The default value is `25%`.
     */
    snappingDistance = input<SnappingDistance>(DEFAULT_SNAPPING_DISTANCE, { ...this._snappingDistanceOptions });

    protected _clickDistance = {
        transform: (v: number) => {
            const valid = validateInt(v);

            if (!valid) {
                console.error('The "clickDistance" parameter must be of type `number`.');
                return DEFAULT_CLICK_DISTANCE;
            }
            return v;
        },
    } as any;

    /**
     * The maximum scroll distance at which a click event is triggered.
     */
    clickDistance = input<number>(DEFAULT_CLICK_DISTANCE, { ...this._clickDistance });

    protected _scrollStartOffsetOptions = {
        transform: (v: number) => {
            const valid = validateFloat(v, true) || isPercentageValue(v);

            if (!valid) {
                console.error('The "scrollStartOffset" parameter must be one of type `number` or `string`.');
                return 0;
            }
            return v;
        },
    } as any;

    /**
     * Sets the scroll start offset value. Can be specified in absolute or percentage values.
     * Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0".
     */
    scrollStartOffset = input<ArithmeticExpression>(0, { ...this._scrollStartOffsetOptions });

    protected _scrollEndOffsetOptions = {
        transform: (v: number) => {
            const valid = validateFloat(v, true) || isPercentageValue(v);

            if (!valid) {
                console.error('The "scrollEndOffset" parameter must be one of type `number` or `string`.');
                return 0;
            }
            return v;
        },
    } as any;

    /**
     * Sets the scroll end offset value. Can be specified in absolute or percentage values.
     * Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0".
     */
    scrollEndOffset = input<ArithmeticExpression>(0, { ...this._scrollEndOffsetOptions });

    protected _scrollBehaviorOptions = {
        transform: (v: ScrollBehavior) => {
            const valid = validateString(v, true, true);

            if (!valid) {
                console.error('The "scrollBehavior" parameter must be of type `boolean`.');
                return DEFAULT_SCROLL_BEHAVIOR;
            }
            return v;
        },
    } as any;

    /**
     * Defines the scrolling behavior for any element on the page. The default value is "smooth".
     */
    scrollBehavior = input<ScrollBehavior>(DEFAULT_SCROLL_BEHAVIOR, { ...this._scrollBehaviorOptions });

    protected _scrollingSettingsOptions = {
        transform: (v: IScrollingSettings): IScrollingSettings | null => {
            let valid = validateObject(v, true, true);
            if (valid && !!v) {
                const { frictionalForce, mass, maxDistance, maxDuration, speedScale, optimization, breakpointStoppingFactor } = v;
                valid = validateFloat(frictionalForce, true);
                if (!valid) {
                    console.error('The "frictionalForce" parameter must be of type `number` or `undefined`.');
                    return DEFAULT_SCROLLING_SETTINGS;
                }
                valid = validateFloat(mass, true);
                if (!valid) {
                    console.error('The "mass" parameter must be of type `number` or `undefined`.');
                    return DEFAULT_SCROLLING_SETTINGS;
                }
                valid = validateFloat(maxDistance, true);
                if (!valid) {
                    console.error('The "maxDistance" parameter must be of type `number` or `undefined`.');
                    return DEFAULT_SCROLLING_SETTINGS;
                }
                valid = validateFloat(maxDuration, true);
                if (!valid) {
                    console.error('The "maxDuration" parameter must be of type `number` or `undefined`.');
                    return DEFAULT_SCROLLING_SETTINGS;
                }
                valid = validateFloat(speedScale, true);
                if (!valid) {
                    console.error('The "speedScale" parameter must be of type `number` or `undefined`.');
                    return DEFAULT_SCROLLING_SETTINGS;
                }
                valid = validateFloat(breakpointStoppingFactor, true);
                if (!valid) {
                    console.error('The "breakpointStoppingFactor" parameter must be of type `number` or `undefined`.');
                    return DEFAULT_SCROLLING_SETTINGS;
                }
                valid = validateBoolean(optimization, true);
                if (!valid) {
                    console.error('The "optimization" parameter must be of type `boolean` or `undefined`.');
                    return DEFAULT_SCROLLING_SETTINGS;
                }
            }
            if (!valid) {
                console.error('The "scrollingSettings" parameter must be of type `object` or null.');
                return DEFAULT_SCROLLING_SETTINGS;
            }
            return {
                frictionalForce: v.frictionalForce !== undefined && v.frictionalForce > 0 ? v.frictionalForce : DEFAULT_SCROLLING_SETTINGS.frictionalForce,
                mass: v.mass !== undefined && v.mass > 0 ? v.mass : DEFAULT_SCROLLING_SETTINGS.mass,
                maxDistance: v.maxDistance !== undefined && v.maxDistance > 0 ? v.maxDistance : DEFAULT_SCROLLING_SETTINGS.maxDistance,
                maxDuration: v.maxDuration !== undefined && v.maxDuration > 0 ? v.maxDuration : DEFAULT_SCROLLING_SETTINGS.maxDuration,
                speedScale: v.speedScale !== undefined && v.speedScale > 0 ? v.speedScale : DEFAULT_SCROLLING_SETTINGS.speedScale,
                breakpointStoppingFactor: v.breakpointStoppingFactor !== undefined && v.breakpointStoppingFactor > 0 ? v.breakpointStoppingFactor : DEFAULT_SCROLLING_SETTINGS.breakpointStoppingFactor,
                optimization: v.optimization ?? DEFAULT_SCROLLING_SETTINGS.optimization,
            };
        },
    } as any;

    /**
     * Scrolling settings.
     * - frictionalForce - Frictional force. Default value is 0.035.
     * - mass - Mass. Default value is 0.005.
     * - maxDistance - Maximum scrolling distance. Default value is 100000.
     * - maxDuration - Maximum animation duration. Default value is 4000.
     * - speedScale - Speed scale. Default value is 10.
     * - optimization - Enables scrolling performance optimization. Default value is `true`.
     */
    scrollingSettings = input<IScrollingSettings>(DEFAULT_SCROLLING_SETTINGS, { ...this._scrollingSettingsOptions });

    protected _motionBlurOptions = {
        transform: (v: number) => {
            const valid = validateFloat(v);

            if (!valid) {
                console.error('The "motionBlur" parameter must be of type `number`.');
                return DEFAULT_MOTION_BLUR;
            }
            return v;
        },
    } as any;

    /**
     * Motion blur effect. The default value is `0.15`.
     */
    motionBlur = input<number>(DEFAULT_MOTION_BLUR, { ...this._motionBlurOptions });

    protected _maxMotionBlurOptions = {
        transform: (v: number) => {
            const valid = validateFloat(v);

            if (!valid) {
                console.error('The "maxMotionBlur" parameter must be of type `number`.');
                return DEFAULT_MAX_MOTION_BLUR;
            }
            return v <= 0 ? DEFAULT_MAX_MOTION_BLUR : v;
        },
    } as any;

    /**
     * Maximum motion blur effect. The default value is `0.5`.
     */
    maxMotionBlur = input<number>(DEFAULT_MAX_MOTION_BLUR, { ...this._maxMotionBlurOptions });

    protected _motionBlurEnabledOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);

            if (!valid) {
                console.error('The "motionBlurEnabled" parameter must be of type `boolean`.');
                return DEFAULT_MOTION_BLUR_ENABLED;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether to apply motion blur or not. The default value is `false`.
     */
    motionBlurEnabled = input<boolean>(DEFAULT_MOTION_BLUR_ENABLED, { ...this._motionBlurEnabledOptions });

    protected _animationParamsOptions = {
        transform: (v: IAnimationParams) => {
            const valid = validateObject(v, true, true);
            if (!valid) {
                console.error('The "animationParams" parameter must be of type `object`.');
                return DEFAULT_ANIMATION_PARAMS;
            }
            if (!validateFloat(v.fadeIn)) {
                console.error('The "fadeIn" parameter must be of type `number`.');
                return DEFAULT_ANIMATION_PARAMS;
            }
            if (!validateFloat(v.fadeOut)) {
                console.error('The "fadeOut" parameter must be of type `number`.');
                return DEFAULT_ANIMATION_PARAMS;
            }
            return v;
        },
    } as any;

    /**
     * Animation parameters. The default value is "{ fadeIn: 500, fadeOut: 500 }".
     */
    animationParams = input<IAnimationParams>(DEFAULT_ANIMATION_PARAMS, { ...this._animationParamsOptions });

    protected _overscrollEnabledOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v, true);

            if (!valid) {
                console.error('The "overscrollEnabled" parameter must be of type `boolean`.');
                return DEFAULT_OVERSCROLL_ENABLED;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether the overscroll (re-scroll) feature will work. The default value is "true".
     */
    overscrollEnabled = input<boolean>(DEFAULT_OVERSCROLL_ENABLED, { ...this._overscrollEnabledOptions });

    protected _positionOptions = {
        transform: (v: SheetPosition) => {
            const valid = validateString(v) && (v === 'left' || v === 'top' || v === 'right' || v === 'bottom');
            if (!valid) {
                console.error('The "position" parameter must be one of `left`, `top`, `right` or `bottom`.');
                return DEFAULT_POSITION;
            }
            return v;
        },
    } as any;

    /**
     * Determines the position in which elements are placed. Default value is "bottom".
     */
    position = input<SheetPosition>(DEFAULT_POSITION, { ...this._positionOptions });

    protected _langTextDirOptions = {
        transform: (v: TextDirection) => {
            const valid = validateString(v) && (v === TextDirections.LTR || v === TextDirections.RTL);
            if (!valid) {
                console.error('The "langTextDir" parameter must be of type `string`.');
                return DEFAULT_LANG_TEXT_DIR;
            }
            return v;
        },
    } as any;

    /**
     * A string indicating the direction of text for the locale.
     * Can be either "ltr" (left-to-right) or "rtl" (right-to-left).
     */
    langTextDir = input<TextDirection>(DEFAULT_LANG_TEXT_DIR, { ...this._langTextDirOptions });

    protected readonly focusedElement = signal<Id | null>(null);

    protected readonly classes = signal<{ [cName: string]: boolean }>({ prepared: true });

    protected readonly overlayClasses: Signal<{ [cName: string]: boolean }>;

    protected readonly overlayStyles: Signal<{ [sName: string]: string }>;

    protected readonly contentClasses: Signal<{ [cName: string]: boolean }>;

    protected readonly contentStyles: Signal<{ [sName: string]: string }>;

    protected _scrollerBounds = signal<ISize | null>(null);

    private _$opened = new BehaviorSubject<boolean>(false);
    protected $opened = this._$opened.asObservable();

    get opened() { return this._$opened.getValue(); }

    protected _$scrollSizeX = new BehaviorSubject<number>(0);

    protected _$scrollSizeY = new BehaviorSubject<number>(0);

    protected _precalculatedScrollStartOffset = signal<number>(0);

    protected _precalculatedScrollEndOffset = signal<number>(0);

    protected _$breakpointInfo = new BehaviorSubject<INtSheetBreakpointInfo | null>(null);
    readonly $breakpointInfo = this._$breakpointInfo.asObservable();
    get breakpointInfo() { return this._$breakpointInfo.getValue(); }

    protected _precalculatedBreakpoints: Signal<ISheetPrecalculatedBreakpoints>;

    protected _direction: Signal<Direction>;

    protected _isVertical: Signal<boolean>;
    protected _$isVertical: Observable<boolean>;
    get $isVertical() { return this._$isVertical; }

    private _$scrollTo = new Subject<IScrollOptions>();
    protected $scrollTo = this._$scrollTo.asObservable();

    protected _$scroll = new Subject<IScrollViewScrollEvent>();
    readonly $scroll = this._$scroll.asObservable();

    protected _$animationUpdate = new BehaviorSubject<number>(0);
    readonly $animationUpdate = this._$animationUpdate.asObservable();

    get $grabbing() { return this._service.$grabbing };

    private _$fireUpdate = new Subject<boolean>();
    protected readonly $fireUpdate = this._$fireUpdate.asObservable();

    private _$fireUpdateNextFrame = new Subject<boolean>();
    protected readonly $fireUpdateNextFrame = this._$fireUpdateNextFrame.asObservable();

    protected _destroyRef = inject(DestroyRef);

    private _animationIds: Array<number> | number | null = null;

    private _$viewInit = new BehaviorSubject<boolean>(false);
    protected readonly $viewInit = this._$viewInit.asObservable();

    protected _controlContainerService = inject(CONTROL_CONTAINER_SERVICE);

    protected _injector = inject(Injector);

    constructor() {
        super();

        let hasUserAction = false;

        this._direction = computed(() => {
            const position = this.position();
            return position === SheetPositions.LEFT || position === SheetPositions.RIGHT ? Directions.HORIZONTAL : Directions.VERTICAL;
        });

        this._isVertical = computed(() => {
            const dir = this._direction(),
                isVertical = isDirection(dir, Directions.VERTICAL);
            return isVertical;
        });

        this._$isVertical = toObservable(this._isVertical);

        this.overlayClasses = computed(() => {
            const dir = this._direction();
            return { [dir]: true };
        });

        this.overlayStyles = computed(() => {
            const isVertical = this._isVertical(),
                bounds = this._bounds() ?? { width: 0, height: 0 };

            return {
                [WIDTH_PROP_NAME]: `${isVertical ? bounds.width : (bounds.width * 2)}${PX}`,
                [HEIGHT_PROP_NAME]: `${isVertical ? (bounds.height * 2) : bounds.height}${PX}`,
            };
        });

        this.contentStyles = computed(() => {
            const isVertical = this._isVertical(),
                bounds = this._bounds() ?? { width: 0, height: 0 };
            return {
                [WIDTH_PROP_NAME]: `${isVertical ? bounds.width : bounds.width}${PX}`,
                [HEIGHT_PROP_NAME]: `${isVertical ? bounds.height : bounds.height}${PX}`,
            };
        });

        this.contentClasses = computed(() => {
            const pos = this.position();
            return { [pos]: true };
        });

        this._precalculatedBreakpoints = computed(() => {
            const langTextDir = this.langTextDir(),
                position = this.position(),
                isStartPosition = position === SheetPositions.LEFT || position === SheetPositions.TOP,
                isVertical = this._isVertical(),
                bounds = this._bounds() ?? { width: 0, height: 0 }, breakpoints = this.breakpoints(),
                viewportSize = (isVertical ? bounds.height : bounds.width),
                result: ISheetPrecalculatedBreakpoints = [];
            let prevPosition = 0;
            const normalizedBreakpoints = [...breakpoints];
            for (let l = normalizedBreakpoints.length, li = l - 1, i = isStartPosition ? 0 : li; isStartPosition ? (i < l) : (i >= 0); isStartPosition ? i++ : i--) {
                const breakpoint = normalizedBreakpoints[i],
                    precalculatedPosition = parseArithmeticExpression(breakpoint.position, viewportSize),
                    size = isStartPosition && i === 0 ? viewportSize : Math.abs(precalculatedPosition - prevPosition),
                    precalculatedBreakpoint: ISheetPrecalculatedBreakpoint = {
                        id: breakpoint.id,
                        position: precalculatedPosition,
                        config: {
                            isVertical,
                            isFirst: i === 0,
                            isLast: i === li,
                            inverted: !isVertical && langTextDir === TextDirections.RTL,
                        },
                        measures: {
                            x: (isVertical ? 0 : (isStartPosition ? (viewportSize - precalculatedPosition) : precalculatedPosition)),
                            y: (isVertical ? (isStartPosition ? (viewportSize - precalculatedPosition) : precalculatedPosition) : 0),
                            maxScrollSize: 0,
                        },
                        bounds: {
                            width: isVertical ? bounds.width : size,
                            height: isVertical ? size : bounds.height,
                        },
                    };
                result.push(precalculatedBreakpoint);
                prevPosition = precalculatedPosition;
            }
            return result;
        });

        const _$created = new BehaviorSubject<boolean>(false),
            $created = _$created.asObservable(),
            $scrollerComponent = toObservable(this._scrollerComponent),
            $precalculatedBreakpoints = toObservable(this._precalculatedBreakpoints),
            $currentBreakpointInfo = this.$breakpointInfo,
            $isVertical = toObservable(this._isVertical),
            $grabbing = this.$grabbing,
            $opened = this.$opened;

        $precalculatedBreakpoints.pipe(
            takeUntilDestroyed(),
            tap(v => {
                this._service.breakpoints = v;
            }),
        ).subscribe();

        combineLatest([$scrollerComponent, this.$initialized]).pipe(
            takeUntilDestroyed(this._destroyRef),
            filter(([scroller, init]) => !!scroller && !!init),
            switchMap(([scroller]) => {
                return combineLatest([$grabbing, $currentBreakpointInfo, scroller!.$scroll, scroller!.$scrollEnd.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    debounceTime(10),
                )]).pipe(
                    takeUntilDestroyed(this._destroyRef),
                    filter(([g, b]) => !g && !!b),
                    tap(([grabbing, breakpointInfo, isMoving]) => {
                        const position = this.position(), isVertical = position === SheetPositions.TOP || position === SheetPositions.BOTTOM,
                            breakpointEvent = new NtSheetBreakpointEvent({
                                id: breakpointInfo!.id,
                                index: breakpointInfo!.index,
                                breakpointRatio: breakpointInfo!.breakpointRatio,
                                ratio: breakpointInfo!.ratio,
                                position,
                                isVertical,
                            });
                        this.onBreakpoint.emit(breakpointEvent);
                    }),
                );
            }),
        ).subscribe();

        combineLatest([$scrollerComponent, this.$initialized]).pipe(
            takeUntilDestroyed(this._destroyRef),
            filter(([scroller, init]) => !!scroller && !!init),
            switchMap(([scroller]) => {
                if (!this._controlContainerService?.scrollView) {
                    return of(null);
                }
                return this._controlContainerService.scrollView.$resizeViewport.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    debounceTime(100),
                    tap(() => {
                        const opened = this.opened,
                            breakpointInfo = this.breakpointInfo,
                            breakpoint = !!breakpointInfo ? this._precalculatedBreakpoints().find(({ id }) => id === breakpointInfo.id) : null;
                        if (!!scroller && !!breakpoint) {
                            if (opened) {
                                switch (this.position()) {
                                    case SheetPositions.LEFT: {
                                        this._animationIds = scroller.scroll({
                                            x: breakpoint.measures.x, behavior: BEHAVIOR_INSTANT, blending: false, duration: 0, fireUpdate: false, userAction: false, snap: false,
                                            onComplete: data => {
                                                this._$animationUpdate.next(data.value);
                                            },
                                        });
                                        break;
                                    }
                                    case SheetPositions.TOP: {
                                        this._animationIds = scroller.scroll({
                                            y: breakpoint.measures.y, behavior: BEHAVIOR_INSTANT, blending: false, duration: 0, fireUpdate: false, userAction: false, snap: false,
                                            onComplete: data => {
                                                this._$animationUpdate.next(data.value);
                                            },
                                        });
                                        break;
                                    }
                                    case SheetPositions.RIGHT: {
                                        this._animationIds = scroller.scroll({
                                            x: breakpoint.measures.x, behavior: BEHAVIOR_INSTANT, blending: false, duration: 0, fireUpdate: false, userAction: false, snap: false,
                                            onComplete: data => {
                                                this._$animationUpdate.next(data.value);
                                            },
                                        });
                                        break;
                                    }
                                    case SheetPositions.BOTTOM:
                                    default: {
                                        this._animationIds = scroller.scroll({
                                            y: breakpoint.position, behavior: BEHAVIOR_INSTANT, blending: false, duration: 0, fireUpdate: false, userAction: false, snap: false,
                                            onComplete: data => {
                                                this._$animationUpdate.next(data.value);
                                            },
                                        });
                                        break;
                                    }
                                }
                            }
                        }
                    }),
                );
            }),
        ).subscribe();

        combineLatest([$scrollerComponent, this.$initialized]).pipe(
            takeUntilDestroyed(this._destroyRef),
            filter(([scroller, init]) => !!scroller && !!init),
            switchMap(([scroller]) => {
                return $opened.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    switchMap(opened => of(opened).pipe(
                        takeUntilDestroyed(this._destroyRef),
                        tap(opened => {
                            if (opened) {
                                this._elementRef.nativeElement.style.display = DISPLAY_BLOCK;
                                this._elementRef.nativeElement.style.opacity = OPACITY_0;
                            } else {
                                switch (this.position()) {
                                    case SheetPositions.LEFT: {
                                        const scrollWeight = this.scrollWidth;
                                        if (this.scrollLeft === scrollWeight) {
                                            this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                            this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                            this._$animationUpdate.next(scrollWeight);
                                        }
                                        break;
                                    }
                                    case SheetPositions.TOP: {
                                        const scrollHeight = this.scrollHeight;
                                        if (this.scrollTop === scrollHeight) {
                                            this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                            this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                            this._$animationUpdate.next(scrollHeight);
                                        }
                                        break;
                                    }
                                    case SheetPositions.RIGHT: {
                                        const endPosition = this._precalculatedScrollEndOffset();
                                        if (this.scrollLeft === endPosition) {
                                            this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                            this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                            this._$animationUpdate.next(endPosition);
                                        }
                                        break;
                                    }
                                    case SheetPositions.BOTTOM:
                                    default: {
                                        const endPosition = this._precalculatedScrollEndOffset();
                                        if (this.scrollTop === endPosition) {
                                            this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                            this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                            this._$animationUpdate.next(endPosition);
                                        }
                                    }
                                }
                            }
                        }),
                        delay(50),
                        tap(opened => {
                            if (!!scroller) {
                                this.stopAnimation();
                                if (!!scroller && opened) {
                                    switch (this.position()) {
                                        case SheetPositions.LEFT: {
                                            const scrollWidth = this.scrollWidth;
                                            scroller.scroll({
                                                x: scrollWidth, behavior: BEHAVIOR_INSTANT, blending: false, duration: 0, userAction: true, fireUpdate: true,
                                                onComplete: data => {
                                                    this._$animationUpdate.next(data.value);
                                                },
                                            });
                                            break;
                                        }
                                        case SheetPositions.TOP: {
                                            const scrollHeight = this.scrollHeight;
                                            scroller.scroll({
                                                y: scrollHeight, behavior: BEHAVIOR_INSTANT, blending: false, duration: 0, userAction: true, fireUpdate: true,
                                                onComplete: data => {
                                                    this._$animationUpdate.next(data.value);
                                                },
                                            });
                                            break;
                                        }
                                    }
                                }
                            }
                        }),
                        delay(50),
                        tap(opened => {
                            if (!!scroller) {
                                if (opened) {
                                    this.stopAnimation();
                                    this._elementRef.nativeElement.style.opacity = OPACITY_1;
                                    switch (this.position()) {
                                        case SheetPositions.LEFT: {
                                            const startPosition = this._precalculatedScrollStartOffset();
                                            this._animationIds = scroller.scroll({
                                                x: startPosition, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeIn, fireUpdate: false, userAction: false,
                                                onUpdate: data => {
                                                    this._$animationUpdate.next(data.value);
                                                },
                                                onComplete: data => {
                                                    this._$animationUpdate.next(data.value);
                                                },
                                            });
                                            break;
                                        }
                                        case SheetPositions.TOP: {
                                            const startPosition = this._precalculatedScrollStartOffset();
                                            this._animationIds = scroller.scroll({
                                                y: startPosition, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeIn, fireUpdate: false, userAction: false,
                                                onUpdate: data => {
                                                    this._$animationUpdate.next(data.value);
                                                },
                                                onComplete: data => {
                                                    this._$animationUpdate.next(data.value);
                                                },
                                            });
                                            break;
                                        }
                                        case SheetPositions.RIGHT: {
                                            const scrollWeight = this.scrollWidth;
                                            this._animationIds = scroller.scroll({
                                                x: scrollWeight, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeIn, fireUpdate: false, userAction: false,
                                                onUpdate: data => {
                                                    this._$animationUpdate.next(data.value);
                                                },
                                                onComplete: data => {
                                                    this._$animationUpdate.next(data.value);
                                                },
                                            });
                                            break;
                                        }
                                        case SheetPositions.BOTTOM:
                                        default: {
                                            const scrollHeight = this.scrollHeight;
                                            this._animationIds = scroller.scroll({
                                                y: scrollHeight, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeIn, fireUpdate: false, userAction: false,
                                                onUpdate: data => {
                                                    this._$animationUpdate.next(data.value);
                                                },
                                                onComplete: data => {
                                                    this._$animationUpdate.next(data.value);
                                                },
                                            });
                                            break;
                                        }
                                    }
                                } else {
                                    this.stopAnimation();
                                    switch (this.position()) {
                                        case SheetPositions.LEFT: {
                                            const scrollWeight = this.scrollWidth;
                                            if (this.scrollLeft !== scrollWeight) {
                                                this._animationIds = scroller.scroll({
                                                    x: scrollWeight, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeOut, fireUpdate: false, userAction: false,
                                                    onUpdate: data => {
                                                        this._$animationUpdate.next(data.value);
                                                    },
                                                    onComplete: data => {
                                                        this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                                        this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                                        this._$animationUpdate.next(data.value);
                                                    },
                                                });
                                            }
                                            break;
                                        }
                                        case SheetPositions.TOP: {
                                            const scrollHeight = this.scrollHeight;
                                            if (this.scrollTop !== scrollHeight) {
                                                this._animationIds = scroller.scroll({
                                                    y: scrollHeight, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeOut, fireUpdate: false, userAction: false,
                                                    onUpdate: data => {
                                                        this._$animationUpdate.next(data.value);
                                                    },
                                                    onComplete: data => {
                                                        this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                                        this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                                        this._$animationUpdate.next(data.value);
                                                    },
                                                });
                                            }
                                            break;
                                        }
                                        case SheetPositions.RIGHT: {
                                            const endPosition = this._precalculatedScrollEndOffset();
                                            if (this.scrollLeft !== endPosition) {
                                                this._animationIds = scroller.scroll({
                                                    x: endPosition, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeOut, fireUpdate: false, userAction: false,
                                                    onUpdate: data => {
                                                        this._$animationUpdate.next(data.value);
                                                    },
                                                    onComplete: data => {
                                                        this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                                        this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                                        this._$animationUpdate.next(data.value);
                                                    },
                                                });
                                            }
                                            break;
                                        }
                                        case SheetPositions.BOTTOM:
                                        default: {
                                            const endPosition = this._precalculatedScrollEndOffset();
                                            if (this.scrollTop !== endPosition) {
                                                this._animationIds = scroller.scroll({
                                                    y: endPosition, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeOut, fireUpdate: false, userAction: false,
                                                    onUpdate: data => {
                                                        this._$animationUpdate.next(data.value);
                                                    },
                                                    onComplete: data => {
                                                        this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                                        this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                                        this._$animationUpdate.next(data.value);
                                                    },
                                                });
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }),
                    )),
                );
            }),
        ).subscribe();

        $scrollerComponent.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            switchMap(scroller => combineLatest([scroller.$scroll, scroller.$scrollEnd]).pipe(
                takeUntilDestroyed(this._destroyRef),
                debounceTime(150),
                tap(() => {
                    switch (this.position()) {
                        case SheetPositions.LEFT: {
                            if (this.opened && this.scrollLeft === this.scrollWidth) {
                                this.stopAnimation();
                                this._$opened.next(false);
                            }
                            break;
                        }
                        case SheetPositions.TOP: {
                            if (this.opened && this.scrollTop === this.scrollHeight) {
                                this.stopAnimation();
                                this._$opened.next(false);
                            }
                            break;
                        }
                        case SheetPositions.RIGHT: {
                            if (this.opened && this.scrollLeft === this._precalculatedScrollEndOffset()) {
                                this.stopAnimation();
                                this._$opened.next(false);
                            }
                            break;
                        }
                        case SheetPositions.BOTTOM:
                        default: {
                            if (this.opened && this.scrollTop === this._precalculatedScrollEndOffset()) {
                                this.stopAnimation();
                                this._$opened.next(false);
                            }
                            break;
                        }
                    }
                }),
            )),
        ).subscribe();

        combineLatest([$scrollerComponent, $precalculatedBreakpoints]).pipe(
            takeUntilDestroyed(),
            filter(([s, p]) => !!s && !!p),
            switchMap(([scroller, breakpoints]) => combineLatest([this.$animationUpdate.pipe(
                takeUntilDestroyed(this._destroyRef),
                startWith(null),
            ), scroller!.$scroll.pipe(
                takeUntilDestroyed(this._destroyRef),
                startWith(false),
            ), scroller!.$scrollEnd.pipe(
                takeUntilDestroyed(this._destroyRef),
                startWith(false),
            )]).pipe(
                takeUntilDestroyed(this._destroyRef),
                debounceTime(0),
                tap(() => {
                    const position = this.position();
                    let actualPosition: number = 0, maxPosition = 0;
                    switch (position) {
                        case SheetPositions.LEFT: {
                            maxPosition = this.scrollWidth;
                            actualPosition = maxPosition - this.scrollLeft;
                            break;
                        }
                        case SheetPositions.TOP: {
                            maxPosition = this.scrollHeight;
                            actualPosition = maxPosition - this.scrollTop;
                            break;
                        }
                        case SheetPositions.RIGHT: {
                            maxPosition = this.scrollWidth;
                            actualPosition = this.scrollLeft;
                            break;
                        }
                        case SheetPositions.BOTTOM:
                        default: {
                            maxPosition = this.scrollHeight;
                            actualPosition = this.scrollTop;
                            break;
                        }
                    }
                    const info = getBreakpointByPosition(breakpoints, actualPosition, maxPosition);
                    if (!!info) {
                        this._$breakpointInfo.next(info);
                    }
                }),
            )),
        ).subscribe();

        $created.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            debounceTime(1),
            tap(v => {
                this._$initialized.next(true);
            }),
        ).subscribe();

        $scrollerComponent.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            tap(component => {
                this._service.initialize(this._id, component, this._parentService);
            }),
        ).subscribe()

        if (!!this._parentService) {
            this._parentService.$scrollable.pipe(
                takeUntilDestroyed(),
                tap(v => {
                    this._service.scrollable = v;
                }),
            ).subscribe();

            this._service.$overscroll.pipe(
                takeUntilDestroyed(),
                tap(v => {
                    if (!!this._parentService) {
                        this._parentService.overscroll = v;
                    }
                }),
            ).subscribe();

            this._parentService.$overscroll.pipe(
                takeUntilDestroyed(),
                tap(v => {
                    this._service.overscroll = v;
                }),
            ).subscribe();
        }

        const $animationParams = toObservable(this.animationParams);
        $animationParams.pipe(
            takeUntilDestroyed(),
            tap(v => {
                this._service.animationParams = v;
            }),
        ).subscribe();

        const $bounds = toObservable(this._bounds).pipe(
            filter(b => !!b),
        ),
            $rawScrollStartOffset = toObservable(this.scrollStartOffset),
            $rawScrollEndOffset = toObservable(this.scrollEndOffset);

        combineLatest([$bounds, $rawScrollStartOffset]).pipe(
            takeUntilDestroyed(),
            tap(([bounds, value]) => {
                const val = parseArithmeticExpression(value, bounds.width);
                this._precalculatedScrollStartOffset.set(val);
            }),
        ).subscribe();

        combineLatest([$bounds, $rawScrollEndOffset]).pipe(
            takeUntilDestroyed(),
            tap(([bounds, value]) => {
                const val = parseArithmeticExpression(value, bounds.width);
                this._precalculatedScrollEndOffset.set(val);
            }),
        ).subscribe();

        this._service?.$tick?.pipe(
            takeUntilDestroyed(),
            tap(() => {
                this._scrollerComponent()?.tick();
            }),
        ).subscribe();

        const $resizeViewport = $scrollerComponent.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            switchMap(scroller => scroller.$resizeViewport),
        ),
            $resizeContent = $scrollerComponent.pipe(
                takeUntilDestroyed(),
                filter(v => !!v),
                switchMap(scroller => scroller.$resizeContent),
            );

        $resizeViewport.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            tap(v => {
                this._bounds.set(v);
                this.onAfterResize(true);
            }),
        ).subscribe();

        $resizeContent.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            tap(v => {
                this._scrollerBounds.set(v);
                this.onAfterResize();
            }),
        ).subscribe();

        const $scrollStartOffset = toObservable(this._precalculatedScrollStartOffset).pipe(
            takeUntilDestroyed(),
            distinctUntilChanged(),
        ),
            $scrollEndOffset = toObservable(this._precalculatedScrollEndOffset).pipe(
                takeUntilDestroyed(),
                distinctUntilChanged(),
            );

        this._scroller = computed(() => {
            return this._scrollerComponent()?.scrollViewport();
        });

        this.$fireUpdateNextFrame.pipe(
            takeUntilDestroyed(),
            debounceTime(0),
            tap(userAction => {
                this._$fireUpdate.next(userAction);
            }),
        ).subscribe();

        const $langTextDir = toObservable(this.langTextDir);
        $langTextDir.pipe(
            takeUntilDestroyed(),
            tap(v => {
                this._service.langTextDir = v;
            }),
        ).subscribe();

        effect(() => {
            const dist = this.clickDistance();
            this._service.clickDistance = dist;
        });

        const $viewInit = this.$viewInit,
            $fireUpdate = this.$fireUpdate,
            $precalculatedScrollStartOffset = toObservable(this._precalculatedScrollStartOffset),
            $precalculatedScrollEndOffset = toObservable(this._precalculatedScrollEndOffset);

        $fireUpdate.pipe(
            takeUntilDestroyed(),
            tap(userAction => {
                hasUserAction = userAction;
            }),
        ).subscribe();

        $viewInit.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            switchMap(() => {
                return combineLatest([
                    $scrollStartOffset, $scrollEndOffset, $bounds, $precalculatedScrollStartOffset, $precalculatedScrollEndOffset,
                ]).pipe(
                    takeUntilDestroyed(this._destroyRef),
                    tap(() => {
                        this._scrollerComponent()?.refreshScrollbar();
                    }),
                );
            }),
        ).subscribe();

        const $direction = toObservable(this._direction);

        $direction.pipe(
            takeUntilDestroyed(),
            tap(v => {
                this._service.direction = v;
            }),
        ).subscribe();

        $scrollStartOffset.pipe(
            takeUntilDestroyed(),
            distinctUntilChanged(),
            tap(v => {
                this._service.scrollStartOffset = v;
            }),
        ).subscribe();

        $scrollEndOffset.pipe(
            takeUntilDestroyed(),
            distinctUntilChanged(),
            tap(v => {
                this._service.scrollEndOffset = v;
            }),
        ).subscribe();

        $direction.pipe(
            takeUntilDestroyed(),
            tap(v => {
                const el: HTMLElement = this._elementRef.nativeElement;
                if (isDirection(Directions.HORIZONTAL, v)) {
                    toggleClassName(el, CLASS_SHEET_HORIZONTAL, [CLASS_SHEET_VERTICAL]);
                } else if (isDirection(Directions.VERTICAL, v)) {
                    toggleClassName(el, CLASS_SHEET_VERTICAL, [CLASS_SHEET_HORIZONTAL]);
                }
            }),
        ).subscribe();

        $viewInit.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            switchMap(() => {
                return $scrollerComponent.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    tap(scroller => {
                        if (!!scroller) {
                            if (!_$created.getValue()) {
                                _$created.next(true);
                            }
                        }
                    }),
                );
            }),
        ).subscribe();

        const $scroller = toObservable(this._scroller).pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            map(v => v.nativeElement),
            take(1),
        ),
            $scrollerScroll = $scrollerComponent.pipe(
                takeUntilDestroyed(),
                filter(v => !!v),
                take(1),
                switchMap(scroller => scroller.$scroll),
            ),
            $scrollerScrollEnd = $scrollerComponent.pipe(
                takeUntilDestroyed(),
                filter(v => !!v),
                take(1),
                switchMap(scroller => scroller.$scrollEnd),
            ),
            $scrollbarScroll = $scrollerComponent.pipe(
                takeUntilDestroyed(),
                filter(v => !!v),
                take(1),
                switchMap(scroller => scroller.$scrollbarScroll),
            );

        $scrollerComponent.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            switchMap(scroller => combineLatest([toObservable(scroller.contentBounds, { injector: this._injector }), $isVertical]).pipe(
                takeUntilDestroyed(this._destroyRef),
                tap(([{ width, height }, isVertical]) => {
                    scroller.totalSize = isVertical ? height : width;
                }),
            )),
        ).subscribe();

        $scrollerComponent.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            take(1),
            tap(scroller => {
                scroller.prepared = true;
            }),
        ).subscribe();

        const scrollHandler = (userAction: boolean = false) => {
            const scroller = this._scrollerComponent();
            if (!!scroller) {
                const scrollSizeX = scroller.scrollLeft,
                    scrollSizeY = scroller.scrollTop;

                this._$scrollSizeX.next(scrollSizeX);
                this._$scrollSizeY.next(scrollSizeY);
            }
        };

        $scroller.pipe(
            takeUntilDestroyed(),
            distinctUntilChanged(),
            switchMap(scroller => {
                return $scrollbarScroll.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    tap(userAction => {
                        const scrollerEl = this._scroller()?.nativeElement, scrollerComponent = this._scrollerComponent();
                        if (!!scrollerEl && !!scrollerComponent) {
                            this.emitScrollEvent(false, true, hasUserAction);
                        }
                    }),
                );
            }),
        ).subscribe();

        $scroller.pipe(
            takeUntilDestroyed(),
            distinctUntilChanged(),
            switchMap(scroller => {
                return $scrollerScroll.pipe(
                    takeUntilDestroyed(this._destroyRef),
                );
            }),
            tap(userAction => {
                hasUserAction = userAction;
                const scrollerEl = this._scroller()?.nativeElement, scrollerComponent = this._scrollerComponent();
                if (!!scrollerEl && !!scrollerComponent) {
                    this.emitScrollEvent(false, true, userAction);
                }
                scrollHandler(userAction);
            }),
        ).subscribe();

        $scroller.pipe(
            takeUntilDestroyed(),
            distinctUntilChanged(),
            switchMap(scroller => {
                return $scrollerScrollEnd.pipe(
                    takeUntilDestroyed(this._destroyRef),
                );
            }),
            tap(userAction => {
                hasUserAction = userAction;
                const scrollerEl = this._scroller()?.nativeElement, scrollerComponent = this._scrollerComponent();
                if (!!scrollerEl && !!scrollerComponent) {
                    this.emitScrollEvent(true, true, userAction);
                }
                scrollHandler(userAction);
            }),
        ).subscribe();

        $bounds.pipe(
            takeUntilDestroyed(),
            distinctUntilChanged(),
            tap(value => {
                const size: ISize = { width: value.width, height: value.height };
                this.onViewportChange.emit(objectAsReadonly(size));
            }),
        ).subscribe();

        const $scrollTo = this.$scrollTo;

        const $scrollToInitialize = this.$initialized;

        combineLatest([$scrollToInitialize, $scrollerComponent, $scrollTo]).pipe(
            takeUntilDestroyed(),
            filter(([i, c, e]) => !!i && !!c && !!e),
            tap(([, s, e]) => {
                const event = e!;
                const behavior = event?.behavior ?? BEHAVIOR_INSTANT,
                    blending = event?.blending ?? false,
                    x = event?.x,
                    y = event?.y,
                    left = event?.left,
                    top = event?.top,
                    onUpdate = event?.onUpdate ?? undefined,
                    onComplete = event?.onComplete ?? undefined,
                    ease = event?.ease,
                    duration = event?.duration;
                s!.stopScrolling();
                s!.scroll({ x, y, left, top, behavior, blending, ease, duration, userAction: true, onUpdate, onComplete });
            }),
        ).subscribe();
    }

    ngAfterViewInit() {
        this._$viewInit.next(true);

        this._$fireUpdate.next(false);
    }

    private stopAnimation() {
        const scroller = this._scrollerComponent();
        if (!!scroller && !!this._animationIds) {
            const animationIds = this._animationIds;
            this._animationIds = null;
            const id = animationIds !== null ? typeof animationIds === 'number' ? animationIds : animationIds.length > 0 ? animationIds[0] : null : null;
            if (id !== null) {
                scroller.stopAnimation(id);
            }
        }
    }

    private onAfterResize(update = false) {
        if (update) {
            const scroller = this._scrollerComponent();
            if (!!scroller) {
                this._$fireUpdate.next(false);
                scroller.refresh(true, true);
            }
        }
    }

    private emitScrollEvent(isScrollEnd: boolean = false, update: boolean = true, userAction: boolean = false) {
        const scrollerComponent = this._scrollerComponent();
        if (!!scrollerComponent) {
            const scrollWidth = scrollerComponent.scrollLeft,
                scrollHeight = scrollerComponent.scrollTop,
                maxScrollWidth = scrollerComponent.scrollWidth,
                maxScrollHeight = scrollerComponent.scrollHeight,
                bounds = this._bounds() || { x: 0, y: 0, width: DEFAULT_SHEET_SIZE, height: DEFAULT_SHEET_SIZE };

            const event = new ScrollEvent({
                directionX: scrollerComponent.scrollDirection,
                directionY: scrollerComponent.scrollDirection,
                bounds,
                scrollerDirection: this._direction(),
                scrollWidth,
                scrollHeight,
                isRight: !scrollerComponent.scrollable || (Math.round(scrollWidth) === Math.round(maxScrollWidth)),
                isBottom: !scrollerComponent.scrollable || (Math.round(scrollHeight) === Math.round(maxScrollHeight)),
                userAction,
            });
            if (update) {
                this._$scroll.next(event);
            }

            if (isScrollEnd) {
                this.onScrollEnd.emit(event);
            } else {
                this.onScroll.emit(event);
            }
        }
    }

    /**
     * Enables the display of the sheet.
     */
    open() {
        this._$opened.next(true);
    }

    /**
     * Hides the sheet.
     */
    close() {
        console.log('close')
        this._$opened.next(false);
    }

    /**
     * The method scrolls the scroll view and returns the animation ids if the behavior is set to smooth or null 
     * if the behavior is set to auto, instant, or not set.
     */
    scrollTo(options: IScrollOptions) {
        this._$scrollTo.next(options);
    }
}