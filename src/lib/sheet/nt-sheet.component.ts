import {
    ChangeDetectionStrategy, Component, computed, DestroyRef, effect, ElementRef, inject, Injector, input, OnDestroy, output, Signal,
    signal, ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
    BehaviorSubject, combineLatest, debounceTime, delay, distinctUntilChanged, filter, map, skip, Subject, switchMap, take, tap, timer,
} from 'rxjs';
import {
    IAnimationParams, INtSheetService,
} from './interfaces';
import {
    Direction, SheetPosition,
} from './types';
import {
    SheetPositions,
} from './enums';
import { objectAsReadonly } from '../common/utils/object';
import {
    ArithmeticExpression, Directions, Id, IScrollingSettings, IScrollOptions, IScrollViewScrollEvent, ISize, SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE,
    SCROLL_VIEW_USER_INTERACTION_ENABLED, TextDirection, TextDirections,
} from '../common';
import { isDirection } from '../common/utils/is-direction';
import {
    isPercentageValue, parseArithmeticExpression, toggleClassName, validateBoolean, validateFloat, validateInt, validateObject, validateString,
} from '../common/utils';
import { ScrollEvent } from '../common/utils/scroll-event';
import { DEFAULT_CLICK_DISTANCE } from '../common/directives/nt-control/const';
import { NtBaseScrollComponent } from '../common/components/nt-base-scroll-component';
import { BEHAVIOR_AUTO, BEHAVIOR_INSTANT } from '../common/const/behavior';
import {
    DEFAULT_LANG_TEXT_DIR, DEFAULT_MAX_MOTION_BLUR, DEFAULT_MOTION_BLUR, DEFAULT_MOTION_BLUR_ENABLED, DEFAULT_OVERSCROLL_ENABLED,
    DEFAULT_SCROLL_BEHAVIOR, DEFAULT_SCROLLING_SETTINGS, DEFAULT_SNAP_SCROLLTO_BOTTOM, DEFAULT_SNAP_SCROLLTO_LEFT, DEFAULT_SNAP_SCROLLTO_RIGHT,
    DEFAULT_SNAP_SCROLLTO_TOP,
} from '../common/const/scroller';
import { CLASS_SHEET_HORIZONTAL, CLASS_SHEET_VERTICAL, DEFAULT_ANIMATION_PARAMS, DEFAULT_POSITION, DEFAULT_SHEET_SIZE } from './const';
import { NtSheetService } from './nt-sheet.service';
import { INtScrollViewService, NtScrollerComponent } from '../scroll-view';
import { DISPLAY_BLOCK, DISPLAY_NONE, HEIGHT_PROP_NAME, OPACITY_0, OPACITY_1, PX, WIDTH_PROP_NAME } from '../common/const/base-prop-names';

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
    extends NtBaseScrollComponent<S, P, NtScrollerComponent> implements OnDestroy {

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
     * Fires when the scroll reaches the left.
     */
    onScrollReachLeft = output<void>();

    /**
     * Fires when the scroll reaches the right.
     */
    onScrollReachRight = output<void>();

    /**
     * Fires when the scroll reaches the top.
     */
    onScrollReachTop = output<void>();

    /**
     * Fires when the scroll reaches the bottom.
     */
    onScrollReachBottom = output<void>();

    protected _$initialized = new BehaviorSubject<boolean>(false);
    readonly $initialized = this._$initialized.asObservable();

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

    protected _scrollLeftOffsetOptions = {
        transform: (v: number) => {
            const valid = validateFloat(v, true) || isPercentageValue(v);

            if (!valid) {
                console.error('The "scrollLeftOffset" parameter must be one of type `number` or `string`.');
                return 0;
            }
            return v;
        },
    } as any;

    /**
     * Sets the scroll left offset value. Can be specified in absolute or percentage values.
     * Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0".
     */
    scrollLeftOffset = input<ArithmeticExpression>(0, { ...this._scrollLeftOffsetOptions });

    protected _scrollTopOffsetOptions = {
        transform: (v: number) => {
            const valid = validateFloat(v, true) || isPercentageValue(v);

            if (!valid) {
                console.error('The "scrollTopOffset" parameter must be one of type `number` or `string`.');
                return 0;
            }
            return v;
        },
    } as any;

    /**
     * Sets the scroll top offset value. Can be specified in absolute or percentage values.
     * Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0".
     */
    scrollTopOffset = input<ArithmeticExpression>(0, { ...this._scrollTopOffsetOptions });

    protected _scrollRightOffsetOptions = {
        transform: (v: number) => {
            const valid = validateFloat(v, true) || isPercentageValue(v);

            if (!valid) {
                console.error('The "scrollRightOffset" parameter must be one of type `number` or `string`.');
                return 0;
            }
            return v;
        },
    } as any;

    /**
     * Sets the scroll right offset value. Can be specified in absolute or percentage values.
     * Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0".
     */
    scrollRightOffset = input<ArithmeticExpression>(0, { ...this._scrollRightOffsetOptions });

    protected _scrollBottomOffsetOptions = {
        transform: (v: number) => {
            const valid = validateFloat(v, true) || isPercentageValue(v);

            if (!valid) {
                console.error('The "scrollBottomOffset" parameter must be one of type `number` or `string`.');
                return 0;
            }
            return v;
        },
    } as any;

    /**
     * Sets the scroll bottom offset value. Can be specified in absolute or percentage values.
     * Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0".
     */
    scrollBottomOffset = input<ArithmeticExpression>(0, { ...this._scrollBottomOffsetOptions });

    protected _snapScrollToLeftOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v, true);

            if (!valid) {
                console.error('The "snapScrollToLeft" parameter must be of type `boolean`.');
                return DEFAULT_SNAP_SCROLLTO_LEFT;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether the scrollbar is snapped to the left of the scroller. The default value is "true".
     * That is, if snapScrollToLeft and snapScrollToRight are enabled, the scroller will initially snap
     * to the left; if you move the scrollbar right, the scroller will snap to the right.
     * If snapScrollToLeft is disabled and snapScrollToRight is enabled, the scroller will snap to the right;
     * If you move the scrollbar left, the scroller will snap to the left.
     * If both snapScrollToLeft and snapScrollToRight are disabled, the scroller will never snap to the left or right.
     */
    snapScrollToLeft = input<boolean>(DEFAULT_SNAP_SCROLLTO_LEFT, { ...this._snapScrollToLeftOptions });

    protected _snapScrollToTopOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v, true);

            if (!valid) {
                console.error('The "snapScrollToTop" parameter must be of type `boolean`.');
                return DEFAULT_SNAP_SCROLLTO_TOP;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether the scrollbar is snapped to the top of the scroller. The default value is "true".
     * That is, if snapScrollToTop and snapScrollToBottom are enabled, the scroller will initially snap
     * to the top; if you move the scrollbar down, the scroller will snap to the bottom.
     * If snapScrollToTop is disabled and snapScrollToBottom is enabled, the scroller will snap to the bottom;
     * If you move the scrollbar up, the scroller will snap to the top.
     * If both snapScrollToTop and snapScrollToBottom are disabled, the scroller will never snap to the top or bottom.
     */
    snapScrollToTop = input<boolean>(DEFAULT_SNAP_SCROLLTO_TOP, { ...this._snapScrollToTopOptions });

    protected _snapScrollToRightOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v, true);

            if (!valid) {
                console.error('The "snapScrollToRight" parameter must be of type `boolean`.');
                return DEFAULT_SNAP_SCROLLTO_RIGHT;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether the scrollbar is snapped to the right of the scroller. The default value is "true".
     * That is, if snapScrollToLeft and snapScrollToRight are enabled, the scroller will initially snap
     * to the left; if you move the scrollbar right, the scroller will snap to the right.
     * If snapScrollToLeft is disabled and snapScrollToRight is enabled, the scroller will snap to the right;
     * If you move the scrollbar left, the scroller will snap to the left.
     * If both snapScrollToLeft and snapScrollToRight are disabled, the scroller will never snap to the left or right.
     */
    snapScrollToRight = input<boolean>(DEFAULT_SNAP_SCROLLTO_RIGHT, { ...this._snapScrollToRightOptions });

    protected _snapScrollToBottomOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v, true);

            if (!valid) {
                console.error('The "snapScrollToBottom" parameter must be of type `boolean`.');
                return DEFAULT_SNAP_SCROLLTO_BOTTOM;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether the scrollbar is snapped to the bottom of the scroller. The default value is "true".
     * That is, if snapScrollToTop and snapScrollToBottom are enabled, the scroller will initially snap
     * to the top; if you move the scrollbar down, the scroller will snap to the bottom.
     * If snapScrollToTop is disabled and snapScrollToBottom is enabled, the scroller will snap to the bottom;
     * If you move the scrollbar up, the scroller will snap to the top.
     * If both snapScrollToTop and snapScrollToBottom are disabled, the scroller will never snap to the top or bottom.
     */
    snapScrollToBottom = input<boolean>(DEFAULT_SNAP_SCROLLTO_BOTTOM, { ...this._snapScrollToBottomOptions });

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
                const { frictionalForce, mass, maxDistance, maxDuration, speedScale, optimization } = v;
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
     * Animation parameters. The default value is "{ scrollToItem: 0 }".
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

    protected _direction: Signal<Direction>;

    protected _langTextDir = {
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
    langTextDir = input<TextDirection>(DEFAULT_LANG_TEXT_DIR, { ...this._langTextDir });

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

    protected _isScrollLeft = signal<boolean>(true);

    protected _isScrollRight = signal<boolean>(false);

    protected _isScrollTop = signal<boolean>(true);

    protected _isScrollBottom = signal<boolean>(false);

    protected _precalculatedScrollLeftOffset = signal<number>(0);

    protected _precalculatedScrollTopOffset = signal<number>(0);

    protected _precalculatedScrollRightOffset = signal<number>(0);

    protected _precalculatedScrollBottomOffset = signal<number>(0);

    private _$scrollTo = new Subject<IScrollOptions>();
    protected $scrollTo = this._$scrollTo.asObservable();

    protected _$scroll = new Subject<IScrollViewScrollEvent>();
    readonly $scroll = this._$scroll.asObservable();

    get $grabbing() { return this._service.$grabbing };

    private _$fireUpdate = new Subject<boolean>();
    protected readonly $fireUpdate = this._$fireUpdate.asObservable();

    private _$fireUpdateNextFrame = new Subject<boolean>();
    protected readonly $fireUpdateNextFrame = this._$fireUpdateNextFrame.asObservable();

    protected _destroyRef = inject(DestroyRef);

    private _animationIds: Array<number> | null = null;

    private _$viewInit = new BehaviorSubject<boolean>(false);
    protected readonly $viewInit = this._$viewInit.asObservable();

    protected _injector = inject(Injector);

    constructor() {
        super();

        let hasUserAction = false;

        this._direction = computed(() => {
            const position = this.position();
            return position === SheetPositions.LEFT || position === SheetPositions.RIGHT ? Directions.HORIZONTAL : Directions.VERTICAL;
        });

        this.overlayClasses = computed(() => {
            const dir = this._direction();
            return { [dir]: true };
        });

        this.overlayStyles = computed(() => {
            const dir = this._direction(),
                isVertical = isDirection(dir, Directions.VERTICAL),
                bounds = this._bounds() ?? { width: 0, height: 0 };

            return {
                [WIDTH_PROP_NAME]: `${isVertical ? bounds.width : (bounds.width * 2)}${PX}`,
                [HEIGHT_PROP_NAME]: `${isVertical ? (bounds.height * 2) : bounds.height}${PX}`,
            };
        });

        this.contentStyles = computed(() => {
            const dir = this._direction(),
                isVertical = isDirection(dir, Directions.VERTICAL),
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

        const _$created = new BehaviorSubject<boolean>(false),
            $created = _$created.asObservable(),
            $scrollerComponent = toObservable(this._scrollerComponent),
            $opened = this.$opened;

        let skipClosing = true;

        const $action = new Subject<void>();
        $action.pipe(
            takeUntilDestroyed(),
            tap(() => {
                skipClosing = true;
            }),
            switchMap(() => timer(10)),
            tap(() => {
                skipClosing = false;
            }),
        ).subscribe();

        combineLatest([$scrollerComponent, this.$initialized]).pipe(
            takeUntilDestroyed(this._destroyRef),
            filter(([scroller, init]) => !!scroller && !!init),
            switchMap(([scroller]) => {
                return $opened.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    switchMap(opened => {
                        if (opened) {
                            $action.next();
                            this._elementRef.nativeElement.style.display = DISPLAY_BLOCK;
                            this._elementRef.nativeElement.style.opacity = OPACITY_0;
                        }
                        return combineLatest([scroller!.$resizeViewport, scroller!.$resizeContent]).pipe(
                            takeUntilDestroyed(this._destroyRef),
                            filter(([v]) => v.width > 0 && v.height > 0),
                            debounceTime(1),
                            tap(() => {
                                if (!!scroller) {
                                    this.stopAnimation();
                                    if (!!scroller && opened) {
                                        switch (this.position()) {
                                            case SheetPositions.LEFT: {
                                                const scrollWidth = this.scrollWidth;
                                                scroller.scroll({
                                                    x: scrollWidth, behavior: BEHAVIOR_INSTANT, blending: false, duration: 0, userAction: true, fireUpdate: true,
                                                });
                                                break;
                                            }
                                            case SheetPositions.TOP: {
                                                const scrollHeight = this.scrollHeight;
                                                scroller.scroll({
                                                    y: scrollHeight, behavior: BEHAVIOR_INSTANT, blending: false, duration: 0, userAction: true, fireUpdate: true,
                                                });
                                                break;
                                            }
                                        }
                                    }
                                }
                            }),
                            delay(50),
                            tap(() => {
                                if (!!scroller) {
                                    if (opened) {
                                        this._elementRef.nativeElement.style.opacity = OPACITY_1;
                                        switch (this.position()) {
                                            case SheetPositions.LEFT: {
                                                const startPosition = this._precalculatedScrollLeftOffset();
                                                this._animationIds = scroller.scroll({
                                                    x: startPosition, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeIn, userAction: true,
                                                });
                                                break;
                                            }
                                            case SheetPositions.TOP: {
                                                const startPosition = this._precalculatedScrollTopOffset();
                                                this._animationIds = scroller.scroll({
                                                    y: startPosition, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeIn, userAction: true,
                                                });
                                                break;
                                            }
                                            case SheetPositions.RIGHT: {
                                                const scrollWeight = this.scrollWidth;
                                                this._animationIds = scroller.scroll({
                                                    x: scrollWeight, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeIn, userAction: true,
                                                });
                                                break;
                                            }
                                            case SheetPositions.BOTTOM:
                                            default: {
                                                const scrollHeight = this.scrollHeight;
                                                this._animationIds = scroller.scroll({
                                                    y: scrollHeight, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeIn, userAction: true,
                                                });
                                                break;
                                            }
                                        }
                                    } else {
                                        switch (this.position()) {
                                            case SheetPositions.LEFT: {
                                                const scrollWeight = this.scrollWidth;
                                                if (this.scrollLeft === scrollWeight) {
                                                    this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                                    this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                                } else {
                                                    this._animationIds = scroller.scroll({
                                                        x: scrollWeight, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeOut, userAction: true, onComplete: () => {
                                                            this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                                            this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                                            this._$opened.next(false);
                                                        },
                                                    });
                                                }
                                                break;
                                            }
                                            case SheetPositions.TOP: {
                                                const scrollHeight = this.scrollHeight;
                                                if (this.scrollTop === scrollHeight) {
                                                    this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                                    this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                                } else {
                                                    this._animationIds = scroller.scroll({
                                                        y: scrollHeight, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeOut, userAction: true, onComplete: () => {
                                                            this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                                            this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                                            this._$opened.next(false);
                                                        },
                                                    });
                                                }
                                                break;
                                            }
                                            case SheetPositions.RIGHT: {
                                                const endPosition = this._precalculatedScrollRightOffset();
                                                if (this.scrollLeft === endPosition) {
                                                    this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                                    this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                                } else {
                                                    this._animationIds = scroller.scroll({
                                                        x: endPosition, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeOut, userAction: true, onComplete: () => {
                                                            this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                                            this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                                            this._$opened.next(false);
                                                        },
                                                    });
                                                }
                                                break;
                                            }
                                            case SheetPositions.BOTTOM:
                                            default: {
                                                const endPosition = this._precalculatedScrollBottomOffset();
                                                if (this.scrollTop === endPosition) {
                                                    this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                                    this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                                } else {
                                                    this._animationIds = scroller.scroll({
                                                        y: endPosition, behavior: BEHAVIOR_AUTO, blending: false, duration: this.animationParams().fadeOut, userAction: true, onComplete: () => {
                                                            this._elementRef.nativeElement.style.display = DISPLAY_NONE;
                                                            this._elementRef.nativeElement.style.opacity = OPACITY_0;
                                                            this._$opened.next(false);
                                                        },
                                                    });
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                            }),
                        );
                    }),
                );
            }),
        ).subscribe();

        $scrollerComponent.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            switchMap(scroller => scroller.$scroll.pipe(
                takeUntilDestroyed(this._destroyRef),
                debounceTime(100),
                tap(() => {
                    if (!skipClosing) {
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
                                if (this.opened && this.scrollLeft === this._precalculatedScrollRightOffset()) {
                                    this.stopAnimation();
                                    this._$opened.next(false);
                                }
                                break;
                            }
                            case SheetPositions.BOTTOM:
                            default: {
                                if (this.opened && this.scrollTop === this._precalculatedScrollBottomOffset()) {
                                    this.stopAnimation();
                                    this._$opened.next(false);
                                }
                                break;
                            }
                        }
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
            $rawScrollLeftOffset = toObservable(this.scrollLeftOffset),
            $rawScrollRightOffset = toObservable(this.scrollRightOffset),
            $rawScrollTopOffset = toObservable(this.scrollTopOffset),
            $rawScrollBottomOffset = toObservable(this.scrollBottomOffset);

        combineLatest([$bounds, $rawScrollLeftOffset]).pipe(
            takeUntilDestroyed(),
            tap(([bounds, value]) => {
                const val = parseArithmeticExpression(value, bounds.width);
                this._precalculatedScrollLeftOffset.set(val);
            }),
        ).subscribe();

        combineLatest([$bounds, $rawScrollRightOffset]).pipe(
            takeUntilDestroyed(),
            tap(([bounds, value]) => {
                const val = parseArithmeticExpression(value, bounds.width);
                this._precalculatedScrollRightOffset.set(val);
            }),
        ).subscribe();

        combineLatest([$bounds, $rawScrollTopOffset]).pipe(
            takeUntilDestroyed(),
            tap(([bounds, value]) => {
                const val = parseArithmeticExpression(value, bounds.height);
                this._precalculatedScrollTopOffset.set(val);
            }),
        ).subscribe();

        combineLatest([$bounds, $rawScrollBottomOffset]).pipe(
            takeUntilDestroyed(),
            tap(([bounds, value]) => {
                const val = parseArithmeticExpression(value, bounds.height);
                this._precalculatedScrollBottomOffset.set(val);
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

        const $scrollLeftOffset = toObservable(this._precalculatedScrollLeftOffset).pipe(
            takeUntilDestroyed(),
            distinctUntilChanged(),
        ),
            $scrollRightOffset = toObservable(this._precalculatedScrollRightOffset).pipe(
                takeUntilDestroyed(),
                distinctUntilChanged(),
            ),
            $scrollTopOffset = toObservable(this._precalculatedScrollTopOffset).pipe(
                takeUntilDestroyed(),
                distinctUntilChanged(),
            ),
            $scrollBottomOffset = toObservable(this._precalculatedScrollBottomOffset).pipe(
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
            $fireUpdate = this.$fireUpdate;

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
                    $scrollLeftOffset, $scrollRightOffset, $scrollTopOffset, $scrollRightOffset, $bounds, $precalculatedScrollLeftOffset,
                    $precalculatedScrollRightOffset, $precalculatedScrollTopOffset, $precalculatedScrollBottomOffset,
                ]).pipe(
                    takeUntilDestroyed(this._destroyRef),
                    tap(() => {
                        this._scrollerComponent()?.refreshScrollbar();
                    }),
                );
            }),
        ).subscribe();

        const $snapScrollToLeft = toObservable(this.snapScrollToLeft),
            $snapScrollToRight = toObservable(this.snapScrollToRight),
            $snapScrollToTop = toObservable(this.snapScrollToTop),
            $snapScrollToBottom = toObservable(this.snapScrollToBottom);

        const $isScrollLeft = toObservable(this._isScrollLeft),
            $isScrollRight = toObservable(this._isScrollRight),
            $isScrollTop = toObservable(this._isScrollTop),
            $isScrollBottom = toObservable(this._isScrollBottom),
            $direction = toObservable(this._direction);

        $snapScrollToLeft.pipe(
            takeUntilDestroyed(),
            tap(v => {
                this._service.snapScrollToLeft = v;
            }),
        ).subscribe();

        $snapScrollToRight.pipe(
            takeUntilDestroyed(),
            tap(v => {
                this._service.snapScrollToRight = v;
            }),
        ).subscribe();

        $snapScrollToTop.pipe(
            takeUntilDestroyed(),
            tap(v => {
                this._service.snapScrollToTop = v;
            }),
        ).subscribe();

        $snapScrollToBottom.pipe(
            takeUntilDestroyed(),
            tap(v => {
                this._service.snapScrollToBottom = v;
            }),
        ).subscribe();

        $direction.pipe(
            takeUntilDestroyed(),
            tap(v => {
                this._service.direction = v;
            }),
        ).subscribe();

        $scrollLeftOffset.pipe(
            takeUntilDestroyed(),
            distinctUntilChanged(),
            tap(v => {
                this._service.scrollLeftOffset = v;
            }),
        ).subscribe();

        $scrollRightOffset.pipe(
            takeUntilDestroyed(),
            distinctUntilChanged(),
            tap(v => {
                this._service.scrollRightOffset = v;
            }),
        ).subscribe();

        $scrollTopOffset.pipe(
            takeUntilDestroyed(),
            distinctUntilChanged(),
            tap(v => {
                this._service.scrollTopOffset = v;
            }),
        ).subscribe();

        $scrollBottomOffset.pipe(
            takeUntilDestroyed(),
            distinctUntilChanged(),
            tap(v => {
                this._service.scrollBottomOffset = v;
            }),
        ).subscribe();

        $isScrollLeft.pipe(
            takeUntilDestroyed(),
            skip(1),
            distinctUntilChanged(),
            debounceTime(0),
            filter(v => !!v),
            tap(() => {
                if (this._scrollerComponent()?.scrollableX) {
                    this.onScrollReachLeft.emit();
                }
            }),
        ).subscribe();

        $isScrollRight.pipe(
            takeUntilDestroyed(),
            skip(1),
            distinctUntilChanged(),
            debounceTime(0),
            filter(v => !!v),
            tap(v => {
                if (this._scrollerComponent()?.scrollableX) {
                    this.onScrollReachRight.emit();
                }
            }),
        ).subscribe();

        $isScrollTop.pipe(
            takeUntilDestroyed(),
            skip(1),
            distinctUntilChanged(),
            debounceTime(0),
            filter(v => !!v),
            tap(v => {
                if (this._scrollerComponent()?.scrollableY) {
                    this.onScrollReachTop.emit();
                }
            }),
        ).subscribe();

        $isScrollBottom.pipe(
            takeUntilDestroyed(),
            skip(1),
            distinctUntilChanged(),
            debounceTime(0),
            filter(v => !!v),
            tap(v => {
                if (this._scrollerComponent()?.scrollableY) {
                    this.onScrollReachBottom.emit();
                }
            }),
        ).subscribe();

        const $precalculatedScrollLeftOffset = toObservable(this._precalculatedScrollLeftOffset),
            $precalculatedScrollRightOffset = toObservable(this._precalculatedScrollRightOffset),
            $precalculatedScrollTopOffset = toObservable(this._precalculatedScrollTopOffset),
            $precalculatedScrollBottomOffset = toObservable(this._precalculatedScrollBottomOffset),
            $scrollerBounds = toObservable(this._scrollerBounds).pipe(
                filter(b => !!b),
            ),
            $scrollSizeX = this._$scrollSizeX.asObservable().pipe(
                takeUntilDestroyed(),
                distinctUntilChanged(),
            ),
            $scrollSizeY = this._$scrollSizeY.asObservable().pipe(
                takeUntilDestroyed(),
                distinctUntilChanged(),
            );

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
            switchMap(scroller => toObservable(scroller.contentBounds, { injector: this._injector }).pipe(
                takeUntilDestroyed(this._destroyRef),
                tap(({ width, height }) => {
                    scroller.totalWidth = width;
                    scroller.totalHeight = height;
                })
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
            scroller.stopAnimation(...animationIds);
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
                directionX: scrollerComponent.scrollDirectionX,
                directionY: scrollerComponent.scrollDirectionY,
                bounds,
                scrollerDirection: this._direction(),
                scrollWidth,
                scrollHeight,
                isRight: !scrollerComponent.scrollableX || this._isScrollRight() || (Math.round(scrollWidth) === Math.round(maxScrollWidth)),
                isBottom: !scrollerComponent.scrollableY || this._isScrollBottom() || (Math.round(scrollHeight) === Math.round(maxScrollHeight)),
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
     * hides the sheet.
     */
    close() {
        this._$opened.next(false);
    }

    /**
     * The method scrolls the scroll view and returns the animation ids if the behavior is set to smooth or null 
     * if the behavior is set to auto, instant, or not set.
     */
    scrollTo(options: IScrollOptions) {
        this._$scrollTo.next(options);
    }

    /**
     * Prevents the list from snapping to its start or end edge.
     */
    preventSnapping() {
        const scroller = this._scrollerComponent();
        this._isScrollLeft.set(false);
        this._isScrollRight.set(false);
        if (!!scroller) {
            scroller.stopScrolling();
        }
    }

    ngOnDestroy(): void {

    }
}