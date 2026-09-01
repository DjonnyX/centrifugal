import { Component, computed, effect, ElementRef, inject, input, output, signal, Signal, TemplateRef, viewChild, ViewEncapsulation } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { combineLatest, debounceTime, filter, of, skip, switchMap, tap } from "rxjs";
import { ArithmeticExpression, Directions, IScrollingSettings, ISize, OVERSCROLL_SERVICE, SnappingDistance, TextDirection, TextDirections } from "../common";
import { NtSliderComponent } from "../slider";
import { isPercentageValue, parseArithmeticExpression, toggleClassName, validateBoolean, validateFloat, validateObject, validateString } from "../common/utils";
import { SDirection } from "../core/nt-s-scroller/types";
import { DEFAULT_ANIMATION_PARAMS, DEFAULT_CONTENT_SCALE, DEFAULT_MAX_MOTION_BLUR, DEFAULT_MOTION_BLUR, DEFAULT_MOTION_BLUR_ENABLED, DEFAULT_SNAPPING_DISTANCE, DEFAULT_SWITCH_DIRECTION, DEFAULT_THUMB_ANIMATION_DURATION, DEFAULT_THUMB_SIZE } from './const';
import { HEIGHT_PROP_NAME, PX, UNSET, WIDTH_PROP_NAME } from "../common/const/base-prop-names";
import { NtService } from "../common/services/nt.service";
import { NtOverscrollService } from "../common/services/nt-overscroll.service";
import { DEFAULT_LANG_TEXT_DIR, DEFAULT_SCROLLING_SETTINGS } from "../common/const/scroller";
import { INtSwitchAnimationParams } from './interfaces';

/**
 * NtSwitchComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/switch/nt-switch.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-switch',
    standalone: false,
    providers: [{
        provide: OVERSCROLL_SERVICE, useClass: NtOverscrollService,
    }],
    encapsulation: ViewEncapsulation.ShadowDom,
    templateUrl: './nt-switch.component.html',
    styleUrl: './nt-switch.component.scss'
})
export class NtSwitchComponent {
    protected _scroller = viewChild<NtSliderComponent>('scroller');

    protected _slider = viewChild<NtSliderComponent>('slider');

    /**
     * Triggers an event when the value changes.
     */
    readonly onChange = output<boolean>();

    protected _interactiveOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);
            if (!valid) {
                console.error('The "interactive" parameter must be of type `boolean`.');
                return true;
            }
            return v;
        },
    } as any;

    /**
     * Interactive. Default value is "true".
     */
    interactive = input<boolean>(true, { ...this._interactiveOptions });

    protected _valueOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);
            if (!valid) {
                console.error('The "value" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Switch value. Default value is `false`.
     */
    value = input<boolean>(false, { ...this._valueOptions });

    protected _directionOptions = {
        transform: (v: SDirection) => {
            const valid = validateString(v) && (v === Directions.HORIZONTAL || v === Directions.VERTICAL);
            if (!valid) {
                console.error(`The "direction" parameter must be one of type \`${Directions.HORIZONTAL}\` or \`${Directions.VERTICAL}\`.`);
                return DEFAULT_SWITCH_DIRECTION;
            }
            return v;
        },
    } as any;

    /**
     * Determines the switch direction. Default value is `horizontal`.
     */
    direction = input<SDirection>(DEFAULT_SWITCH_DIRECTION, { ...this._directionOptions });

    protected _animationParamsOptions = {
        transform: (v: INtSwitchAnimationParams) => {
            const valid = validateObject(v, true, true);
            if (!validateFloat(v.scroll)) {
                console.error('The "scroll" parameter must be of type `number`.');
                return DEFAULT_ANIMATION_PARAMS;
            }
            if (!validateFloat(v.snapByDivision)) {
                console.error('The "snapByDivision" parameter must be of type `number`.');
                return DEFAULT_ANIMATION_PARAMS;
            }
            if (!valid) {
                console.error('The "animationParams" parameter must be of type `object`.');
                return DEFAULT_ANIMATION_PARAMS;
            }
            return v;
        },
    } as any;

    /**
     * Animation parameters. The default value is "{ scroll: 500, snapByDivision: 250 }".
     */
    animationParams = input<INtSwitchAnimationParams>(DEFAULT_ANIMATION_PARAMS, { ...this._animationParamsOptions });

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
     * The default value is `50%`.
     */
    snappingDistance = input<SnappingDistance>(DEFAULT_SNAPPING_DISTANCE, { ...this._snappingDistanceOptions });

    protected _contentScaleOptions = {
        transform: (v: number) => {
            const valid = validateFloat(v);
            if (!valid) {
                console.error('The "contentScale" parameter must be of type `number`.');
                return DEFAULT_CONTENT_SCALE;
            }
            return v;
        },
    } as any;

    /**
     * Scale of content. Default value is `1.05`.
     */
    contentScale = input<number>(DEFAULT_CONTENT_SCALE, { ...this._contentScaleOptions });

    protected _thumbSizeOptions = {
        transform: (v: number) => {
            const valid = validateFloat(v) || isPercentageValue(v);
            if (!valid) {
                console.error('The "thumbSize" parameter must be of type `ArithmeticExpression`.');
                return DEFAULT_THUMB_SIZE;
            }
            return v;
        },
    } as any;

    /**
     * Switch  thumb size.
     * Can be specified in absolute or percentage values.
     * Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0".
     * Default value is `50%`.
     */
    thumbSize = input<ArithmeticExpression>(DEFAULT_THUMB_SIZE, { ...this._thumbSizeOptions });

    protected _thumbAnimationDurationOptions = {
        transform: (v: string) => {
            const valid = validateString(v);
            if (!valid) {
                console.error('The "thumbAnimationDuration" parameter must be of type `string`.');
                return DEFAULT_THUMB_ANIMATION_DURATION;
            }
            return v;
        },
    } as any;

    /**
     * Content scale. Default value is `150ms`.
     */
    thumbAnimationDuration = input<string>(DEFAULT_THUMB_ANIMATION_DURATION, { ...this._thumbAnimationDurationOptions });

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
     * Motion blur effect. The default value is `2`.
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
     * Maximum motion blur effect. The default value is `5`.
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
     * - breakpointStoppingFactor - Default value is 10.
     * - optimization - Enables scrolling performance optimization. Default value is `true`.
     */
    scrollingSettings = input<IScrollingSettings>(DEFAULT_SCROLLING_SETTINGS, { ...this._scrollingSettingsOptions });

    protected _overscrollAreaLeftRendererOptions = {
        transform: (v: TemplateRef<any> | null) => {
            const valid = validateObject(v, true, true);

            if (!valid) {
                console.error('The "overscrollAreaLeftRenderer" parameter must be of type `TemplateRef<any>`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Specifies a custom template for the left overscroll area.
     */
    overscrollAreaLeftRenderer = input<TemplateRef<any> | null>(null, { ...this._overscrollAreaLeftRendererOptions });

    protected _overscrollAreaTopRendererOptions = {
        transform: (v: TemplateRef<any> | null) => {
            const valid = validateObject(v, true, true);

            if (!valid) {
                console.error('The "overscrollAreaTopRenderer" parameter must be of type `TemplateRef<any>`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Specifies a custom template for the top overscroll area.
     */
    overscrollAreaTopRenderer = input<TemplateRef<any> | null>(null, { ...this._overscrollAreaTopRendererOptions });

    protected _overscrollAreaRightRendererOptions = {
        transform: (v: TemplateRef<any> | null) => {
            const valid = validateObject(v, true, true);

            if (!valid) {
                console.error('The "overscrollAreaRightRenderer" parameter must be of type `TemplateRef<any>`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Specifies a custom template for the right overscroll area.
     */
    overscrollAreaRightRenderer = input<TemplateRef<any> | null>(null, { ...this._overscrollAreaRightRendererOptions });

    protected _overscrollAreaBottomRendererOptions = {
        transform: (v: TemplateRef<any> | null) => {
            const valid = validateObject(v, true, true);

            if (!valid) {
                console.error('The "overscrollAreaBottomRenderer" parameter must be of type `TemplateRef<any>`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Specifies a custom template for the bottom overscroll area.
     */
    overscrollAreaBottomRenderer = input<TemplateRef<any> | null>(null, { ...this._overscrollAreaBottomRendererOptions });

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

    /**
     * Extra parameters that will be passed to the custom thumb renderer.
     */
    readonly params = input<{ [propName: string]: any } | null>({});

    /**
     * Custom thumb renderer.
     */
    readonly renderer = input<TemplateRef<any> | null>(null);

    protected _overscrollService = inject(OVERSCROLL_SERVICE);

    get scrollLeft(): number {
        return this._scroller()?.scrollLeft ?? 0;
    }

    get scrollTop(): number {
        return this._scroller()?.scrollTop ?? 0;
    }

    get scrollWidth(): number {
        return this._scroller()?.scrollWidth ?? 0;
    }

    get scrollHeight(): number {
        return this._scroller()?.scrollHeight ?? 0;
    }

    protected _sliderValue = signal<number>(0);

    protected _isVertical: Signal<boolean>;

    protected _size: Signal<number>;

    protected _precalculatedThumbSize: Signal<number>;

    protected _containerClass: Signal<{ [cName: string]: boolean; }>;

    protected _contentStyle: Signal<{ [sName: string]: string }>;

    protected _scrollerContentStyle: Signal<{ [sName: string]: string }>;

    protected _elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);

    protected _bounds = signal<ISize>({
        width: this._elementRef.nativeElement.offsetWidth,
        height: this._elementRef.nativeElement.offsetHeight,
    });

    protected _service = inject(NtService);

    constructor() {
        effect(() => {
            this._sliderValue.set(this.value() === true ? 1 : 0);
        });

        this._isVertical = computed(() => {
            const direction = this.direction();
            return direction === Directions.VERTICAL;
        });

        effect(() => {
            const isVertical = this._isVertical();
            toggleClassName(this._elementRef.nativeElement,
                isVertical ? Directions.VERTICAL : Directions.HORIZONTAL,
                [isVertical ? Directions.HORIZONTAL : Directions.VERTICAL]
            );
        });

        this._size = computed(() => {
            const isVertical = this._isVertical(), bounds = this._bounds();
            return (isVertical ? bounds.height : bounds.width) * this.contentScale();
        });

        this._precalculatedThumbSize = computed(() => {
            const isVertical = this._isVertical(), bounds = this._bounds(), thumbSize = this.thumbSize();
            return parseArithmeticExpression(thumbSize, isVertical ? bounds.height : bounds.width);
        });

        this._contentStyle = computed(() => {
            const isVertical = this._isVertical(), size = this._size();
            return { [isVertical ? HEIGHT_PROP_NAME : WIDTH_PROP_NAME]: `${size}${PX}` };
        });

        this._scrollerContentStyle = computed(() => {
            const isVertical = this._isVertical(), size = this._size();
            return {
                position: 'relative', display: 'grid', 'align-items': 'center', width: '100%', height: '100%',
                [isVertical ? HEIGHT_PROP_NAME : WIDTH_PROP_NAME]: `${size}${PX}`, gridTemplateColumns: isVertical ? UNSET : '1fr 1fr',
                gridTemplateRows: isVertical ? '1fr 1fr' : UNSET,
            };
        });

        this._containerClass = computed(() => {
            return { [this.direction()]: true };
        });

        const $value = toObservable(this._sliderValue);
        $value.pipe(
            takeUntilDestroyed(),
            skip(1),
            debounceTime(1),
            tap(v => {
                this.onChange.emit(v !== 0);
            }),
        ).subscribe();

        this._service.$tick.pipe(
            takeUntilDestroyed(),
            tap(() => {
                const {
                    width: viewportWidth,
                    height: viewportHeight,
                } = this._bounds(),
                    width = this._elementRef.nativeElement.offsetWidth,
                    height = this._elementRef.nativeElement.offsetHeight;
                if (viewportWidth !== width || viewportHeight !== height) {
                    this._bounds.set({ width, height });
                }
            }),
        ).subscribe();

        const $slider = toObservable(this._slider).pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
        ),
            $scroll = $slider.pipe(
                takeUntilDestroyed(),
                switchMap(s => s!.$scroll || of(undefined)),
            ),
            $scrollEnd = $slider.pipe(
                takeUntilDestroyed(),
                switchMap(s => s!.$scrollEnd || of(undefined)),
            ),
            $isVertical = toObservable(this._isVertical);

        combineLatest([$isVertical, $slider, $scroll, $scrollEnd]).pipe(
            takeUntilDestroyed(),
            tap(([isVertical, slider]) => {
                const scrollPosition = (isVertical ? slider.scrollTop : slider.scrollLeft),
                    scrollSize = (isVertical ? slider.scrollHeight : slider.scrollWidth),
                    scrollValue = scrollSize !== 0 ? (scrollPosition / scrollSize) : 0,
                    scroller = this._scroller();
                if (!!scroller) {
                    if (isVertical) {
                        scroller.scrollTop = this.scrollHeight * scrollValue;
                    } else {
                        scroller.scrollLeft = this.scrollWidth * scrollValue;
                    }
                }
            }),
        ).subscribe();
    }

    protected onChangeHandler(value: number) {
        this._sliderValue.set(value);
    }

    protected onVirtualClickHandler(e: PointerEvent | TouchEvent) {
        const slider = this._slider();
        if (!!slider) {
            const value = slider.value(), nextValue = value !== 0 ? 0 : 1;
            this._sliderValue.set(nextValue);
        }
    }
}
