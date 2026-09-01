import {
  Component, computed, DestroyRef, effect, ElementRef, inject, input, output, Signal, signal, TemplateRef, viewChild, ViewEncapsulation,
} from "@angular/core";
import {
  ArithmeticExpression, Directions, GradientColorPositions, Id, IScrollingSettings, ISize, SCROLL_VIEW_AXLE_LOCK, SCROLL_VIEW_INVERSION, SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO,
  SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE, SCROLL_VIEW_TYPE, SnappingDistance, TextDirection, TextDirections,
} from "../common";
import { DEFAULT_MAX_MOTION_BLUR, DEFAULT_MOTION_BLUR, DEFAULT_MOTION_BLUR_ENABLED, DEFAULT_SIZE, DEFAULT_THUMB_SIZE } from "./const";
import { DEFAULT_LANG_TEXT_DIR, DEFAULT_SCROLL_BEHAVIOR, DEFAULT_SCROLLBAR_INTERACTIVE } from "../common/const/scroller";
import {
  isPercentageValue, parseArithmeticExpression, toggleClassName, validateBoolean, validateFloat, validateObject, validateString,
} from "../common/utils";
import {
  DEFAULT_ANIMATION_PARAMS, DEFAULT_OVERSCROLL_ENABLED, DEFAULT_SCROLLING_SETTINGS, DEFAULT_SLIDER_DIRECTION, DEFAULT_SNAPPING_DISTANCE,
} from './const';
import { INtSliderAnimationParams, INtSliderService, ISliderStep, ISliderSteps } from './interfaces';
import { BEHAVIOR_AUTO, BEHAVIOR_INSTANT } from "../common/const/behavior";
import { LEFT_PROP_NAME, TOP_PROP_NAME } from "../common/const/base-prop-names";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, map, startWith, Subject, switchMap, tap } from "rxjs";
import { NtSliderService } from './nt-slider.service';
import { ScrollBox } from '../common/utils/scroll-box';
import { ScrollerTypes } from "../common/enums/scroller-types";
import { ISliderDragEvent, NtBaseSliderComponent, NtBaseSliderPublicService, NtBaseSliderService } from "../core/nt-base-slider";
import { SDirection } from "../core/nt-s-scroller/types";
import { INtOverscrollService } from "../common/interfaces/nt-overscroll-service";
import { IUpdateParams } from './interfaces';
import { INtScrollViewService } from "../scroll-view";
import { NtBaseComponent } from "../common/components/nt-base-component";

/**
 * NtSliderComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/slider/nt-slider.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
  selector: 'nt-slider',
  templateUrl: './nt-slider.component.html',
  styleUrl: './nt-slider.component.scss',
  host: {
    'style': 'position: relative; display: block;'
  },
  standalone: false,
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [
    { provide: SCROLL_VIEW_TYPE, useValue: ScrollerTypes.SLIDER_SCROLLER },
    { provide: SCROLL_VIEW_INVERSION, useValue: true },
    { provide: SCROLL_VIEW_AXLE_LOCK, useValue: true },
    { provide: SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO, useValue: false },
    { provide: SCROLL_VIEW_OVERSCROLL_ENABLED, useValue: true },
    { provide: SCROLL_VIEW_SERVICE, useClass: NtSliderService },
    NtBaseSliderService,
    NtBaseSliderPublicService,
  ],
})
export class NtSliderComponent<S extends INtSliderService = any, P extends INtScrollViewService = any> extends NtBaseComponent<S, P> {
  protected _baseSlider = viewChild<NtBaseSliderComponent>('baseSlider');

  get component(): NtBaseSliderComponent | undefined { return this._baseSlider(); }

  /**
   * Fires a drag event.
   */
  readonly onDrag = output<ISliderDragEvent>();

  /**
   * Fires a drag end event.
   */
  readonly onDragEnd = output<ISliderDragEvent>();

  /**
   * Triggers an event with a step ID when the step moves the specified distance.
   */
  readonly onSnap = output<Id>();

  /**
   * Triggers an event when the value changes.
   */
  readonly onChange = output<number>();

  /**
   * Triggers an event when clicked.
   */
  readonly onVirtualClick = output<PointerEvent | TouchEvent>();

  /**
   * Clicking on a track triggers an event.
   */
  readonly onTrackVirtualClick = output<PointerEvent | TouchEvent>();

  protected _directionOptions = {
    transform: (v: SDirection) => {
      const valid = validateString(v) && (v === Directions.HORIZONTAL || v === Directions.VERTICAL);
      if (!valid) {
        console.error(`The "direction" parameter must be one of type \`${Directions.HORIZONTAL}\` or \`${Directions.VERTICAL}\`.`);
        return DEFAULT_SLIDER_DIRECTION;
      }
      return v;
    },
  } as any;

  /**
   * Determines the slider direction. Default value is "horizontal".
   */
  direction = input<SDirection>(DEFAULT_SLIDER_DIRECTION, { ...this._directionOptions });

  protected _overscrollAreaShowAutomaticallyOptions = {
    transform: (v: boolean) => {
      const valid = validateBoolean(v);

      if (!valid) {
        console.error('The "overscrollAreaShowAutomatically" parameter must be of type `boolean`.');
        return true;
      }
      return v;
    },
  } as any;

  /**
   *  Sets whether overscroll areas are automatically displayed if the value is true.
   */
  overscrollAreaShowAutomatically = input<boolean>(true, { ...this._overscrollAreaShowAutomaticallyOptions });

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
   * Determines whether the overscroll (re-scroll) feature will work. The default value is "false".
   */
  overscrollEnabled = input<boolean>(DEFAULT_OVERSCROLL_ENABLED, { ...this._overscrollEnabledOptions });

  protected _valueOptions = {
    transform: (v: number) => {
      const val = Number(v), valid = validateFloat(val);
      if (!valid) {
        console.error('The "value" parameter must be of type `number`.');
        return 0;
      }
      return val;
    },
  } as any;

  /**
   * Slider value. Default value is `0`.
   */
  value = input<number>(0, { ...this._valueOptions });

  protected _minOptions = {
    transform: (v: number) => {
      const valid = validateFloat(v);
      if (!valid) {
        console.error('The "min" parameter must be of type `number`.');
        return 0;
      }
      return v;
    },
  } as any;

  /**
   * Slider min value. Default min value is `0`.
   */
  min = input<number>(0, { ...this._minOptions });

  protected _maxOptions = {
    transform: (v: number) => {
      const valid = validateFloat(v);
      if (!valid) {
        console.error('The "max" parameter must be of type `number`.');
        return 0;
      }
      return v;
    },
  } as any;

  /**
   * Slider max value. Required.
   */
  max = input.required<number>({ ...this._maxOptions });

  protected _stepOptions = {
    transform: (v: number) => {
      const valid = validateFloat(v);
      if (!valid) {
        console.error('The "step" parameter must be of type `number`.');
        return 0;
      }
      return v;
    },
  } as any;

  /**
   * Step. Default value is `0`.
   */
  step = input<number>(0, { ...this._stepOptions });

  protected _interactiveOptions = {
    transform: (v: boolean) => {
      const valid = validateBoolean(v);
      if (!valid) {
        console.error('The "interactive" parameter must be of type `boolean`.');
        return DEFAULT_SCROLLBAR_INTERACTIVE;
      }
      return v;
    },
  } as any;

  /**
   * Determines whether the slider will respond to user interaction or not. The default value is `true`.
   */
  interactive = input<boolean>(DEFAULT_SCROLLBAR_INTERACTIVE, { ...this._interactiveOptions });

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
        console.error('The "scrollEndOffset" parameter must be one of type `ArithmeticExpression`.');
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

  protected _behaviorOptions = {
    transform: (v: ScrollBehavior) => {
      const valid = validateString(v, true, true);

      if (!valid) {
        console.error('The "behavior" parameter must be of type `ScrollBehavior`.');
        return DEFAULT_SCROLL_BEHAVIOR;
      }
      return v;
    },
  } as any;

  /**
   * Defines the scrolling behavior for any element on the page. The default value is "smooth".
   */
  behavior = input<ScrollBehavior>(DEFAULT_SCROLL_BEHAVIOR, { ...this._behaviorOptions });

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

  protected _animationParamsOptions = {
    transform: (v: INtSliderAnimationParams) => {
      const valid = validateObject(v, true, true);
      if (!validateFloat(v.scroll)) {
        console.error('The "scroll" parameter must be of type `number`.');
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
   * Animation parameters. The default value is "{ scroll: 500 }".
   */
  animationParams = input<INtSliderAnimationParams>(DEFAULT_ANIMATION_PARAMS, { ...this._animationParamsOptions });

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
   * Slider thumb size.
   * Can be specified in absolute or percentage values.
   * Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0".
   * Default value is `25%`.
   */
  thumbSize = input<ArithmeticExpression>(DEFAULT_THUMB_SIZE, { ...this._thumbSizeOptions });

  /**
   * Extra parameters that will be passed to the custom thumb renderer.
   */
  readonly params = input<{ [propName: string]: any } | null>({});

  /**
   * Custom thumb renderer.
   */
  readonly renderer = input<TemplateRef<any> | null>(null);

  readonly overscrollService = input<INtOverscrollService | null>(null);

  private _$update = new Subject<IUpdateParams | null>();
  protected $update = this._$update.asObservable();

  get $scroll() { return this._baseSlider()?.$scroll; }

  get $scrollEnd() { return this._baseSlider()?.$scrollEnd; }

  get scrollLeft(): number {
    return this._baseSlider()?.scrollLeft ?? 0;
  }

  set scrollLeft(v: number) {
    const component = this._baseSlider();
    if (!!component) {
      component.scroll({ x: v, behavior: BEHAVIOR_INSTANT, userAction: true, fireUpdate: true });
    }
  }

  get scrollTop(): number {
    return this._baseSlider()?.scrollTop ?? 0;
  }

  set scrollTop(v: number) {
    const component = this._baseSlider();
    if (!!component) {
      component.scroll({ y: v, behavior: BEHAVIOR_INSTANT, userAction: true, fireUpdate: true });
    }
  }

  get scrollWidth(): number {
    return this._baseSlider()?.scrollWidth ?? 0;
  }

  get scrollHeight(): number {
    return this._baseSlider()?.scrollHeight ?? 0;
  }

  protected _thumbGradientPositions = signal<GradientColorPositions>([0, 0]);

  protected _thickness = signal<number>(20);

  protected _precalculatedThumbSize = signal<number>(0);

  protected _precalculatedScrollStartOffset = signal<number>(0);

  protected _precalculatedScrollEndOffset = signal<number>(0);

  protected _snapToItem: Signal<boolean>;

  protected _inputValue = signal<number>(0);

  protected _actualValue = signal<number>(0);

  protected _size = signal<number>(DEFAULT_SIZE);

  protected _$init = new BehaviorSubject<boolean>(false);
  readonly $init = this._$init.asObservable();
  get init() { return this._$init.getValue(); }

  protected _isVertical: Signal<boolean>;

  private _scrollBox = new ScrollBox();

  private _animationIds: Array<number> | number | null = null;

  protected _destroyRef = inject(DestroyRef);

  constructor() {
    super();

    this._isVertical = computed(() => {
      const direction = this.direction();
      return direction === Directions.VERTICAL;
    });

    const $bounds = toObservable(this._bounds).pipe(
      filter(b => !!b),
    ), $scroller = toObservable(this._baseSlider).pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
    ),
      $contentResize = $scroller.pipe(
        takeUntilDestroyed(),
        switchMap(scroller => scroller.$resizeContent.pipe(
          takeUntilDestroyed(this._destroyRef),
          startWith(null),
        )),
      ), $viewportResize = $scroller.pipe(
        takeUntilDestroyed(),
        switchMap(scroller => scroller.$resizeViewport.pipe(
          takeUntilDestroyed(this._destroyRef),
          startWith(null),
        )),
      );

    let resizing = false;
    combineLatest([$contentResize, $viewportResize, $bounds]).pipe(
      takeUntilDestroyed(),
      tap(() => {
        resizing = true;
      }),
      debounceTime(250),
      tap(() => {
        resizing = false;
      }),
    ).subscribe();

    const $baseSlider = toObservable(this._baseSlider),
      $isVertical = toObservable(this._isVertical),
      $rawScrollStartOffset = toObservable(this.scrollStartOffset),
      $rawScrollEndOffset = toObservable(this.scrollEndOffset),
      $init = this.$init.pipe(
        takeUntilDestroyed(),
        debounceTime(250),
      ),
      $value = toObservable(this._actualValue),
      $max = toObservable(this.max),
      $min = toObservable(this.min),
      $step = toObservable(this.step);

    effect(() => {
      const isVertical = this._isVertical();
      toggleClassName(this._elementRef.nativeElement,
        isVertical ? Directions.VERTICAL : Directions.HORIZONTAL,
        [isVertical ? Directions.HORIZONTAL : Directions.VERTICAL]
      );
    });

    let init = false;
    $init.pipe(
      takeUntilDestroyed(),
      debounceTime(1),
      filter(v => !!v),
      tap(v => {
        init = v;
      })
    ).subscribe();

    const $update = combineLatest([this.$update, $baseSlider.pipe(
      filter(v => !!v),
      switchMap(slider => slider.$resizeContent.pipe(
        takeUntilDestroyed(this._destroyRef),
        startWith(null),
      )),
    )]);

    $update.pipe(
      takeUntilDestroyed(),
      map(([v]) => v),
      distinctUntilChanged(),
      filter(v => !!v),
      tap(v => {
        const baseSlider = this._baseSlider();
        if (init && (!baseSlider || baseSlider.grabbing || this._animationIds !== null)) {
          return;
        }
        const isVertical = this._isVertical();
        if (resizing) {
          const { position } = this.calculateSliderParams(this._actualValue())!;
          baseSlider!.stopScrolling(true);
          baseSlider!.scroll({
            [isVertical ? TOP_PROP_NAME : LEFT_PROP_NAME]: position,
            fireUpdate: true,
            behavior: BEHAVIOR_INSTANT,
            userAction,
            blending: false,
            snap: false,
            duration: 0,
          });
        } else {
          const startOffset = this._precalculatedScrollStartOffset(),
            {
              position,
              animated,
              userAction,
            } = v as IUpdateParams,
            useAnimation = init && animated && userAction;

          const actualThumbPosition = position < startOffset ? startOffset : position;
          baseSlider!.stopScrolling(true);
          baseSlider!.scroll({
            [isVertical ? TOP_PROP_NAME : LEFT_PROP_NAME]: actualThumbPosition,
            fireUpdate: true,
            behavior: useAnimation ? BEHAVIOR_AUTO : BEHAVIOR_INSTANT,
            userAction,
            blending: false,
            snap: false,
            duration: useAnimation ? this.animationParams().scroll : 0,
          });
        }
      }),
    ).subscribe();

    const $slider = toObservable(this._baseSlider);
    $slider.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      tap(component => {
        this._service.initialize(this._id, component, this._parentService);
      }),
    ).subscribe();

    const $val = toObservable(this.value);
    $val.pipe(
      takeUntilDestroyed(),
      debounceTime(0),
      tap(v => {
        this._inputValue.set(v);
      }),
    ).subscribe();

    const $inputValue = toObservable(this.value);
    $inputValue.pipe(
      takeUntilDestroyed(),
      tap(v => {
        this._actualValue.set(v);
      }),
    ).subscribe();

    this._snapToItem = computed(() => {
      const step = this.step();
      return step > 0;
    });

    this._service.$tick.pipe(
      takeUntilDestroyed(),
      tap(() => {
        this._baseSlider()?.tick();
        const {
          width: viewportWidth,
          height: viewportHeight,
        } = this._bounds(),
          width = this._elementRef.nativeElement.offsetWidth,
          height = this._elementRef.nativeElement.offsetHeight;
        if (viewportWidth !== width || viewportHeight !== height) {
          this._bounds.set({ width, height });
        }
        const isVertical = this._isVertical();
        this._thickness.set(isVertical ? viewportWidth : viewportHeight);
      }),
    ).subscribe();

    this._service?.$intersectionElementBySnapToItemAlign?.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      tap(id => {
        this.onSnap.emit(id);
      }),
    ).subscribe();

    $init.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      switchMap(() => $value.pipe(
        takeUntilDestroyed(this._destroyRef),
        distinctUntilChanged(),
        debounceTime(0),
        tap(v => {
          if (!Number.isNaN(v)) {
            this.onChange.emit(v);
          }
        }),
      )),
    ).subscribe();

    $baseSlider.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      switchMap(baseSlider => combineLatest([$isVertical, $init, $bounds, $step, $min, $max, $value, baseSlider.$scroll.pipe(
        takeUntilDestroyed(this._destroyRef),
        startWith(true),
      ), baseSlider.$wheel.pipe(
        takeUntilDestroyed(this._destroyRef),
        startWith(false),
      ), baseSlider.$scrollEnd.pipe(
        takeUntilDestroyed(this._destroyRef),
        startWith(true),
      ), this._service?.$intersectionElementBySnapToItemAlign.pipe(
        takeUntilDestroyed(this._destroyRef),
        startWith(null),
      )]).pipe(
        takeUntilDestroyed(this._destroyRef),
        debounceTime(0),
        filter(([, init, , , , , , s]) => !!s && init),
        tap(([, , , , , , , s]) => {
          if (!resizing && !!s) {
            this.setupValue();
          }
        }),
      ),
      ),
    ).subscribe();

    $baseSlider.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      switchMap(baseSlider => baseSlider.$scrollEnd.pipe(
        takeUntilDestroyed(this._destroyRef),
        startWith(true),
      ).pipe(
        takeUntilDestroyed(this._destroyRef),
        tap(userAction => {
          if (!resizing && userAction) {
            this.setupValue();
            this._actualValue.set(this._inputValue());
          }
        }),
        debounceTime(1),
        filter(userAction => !!userAction),
        tap(() => {
          this.onChange.emit(this._inputValue());
        }),
      ),
      ),
    ).subscribe();

    $baseSlider.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      switchMap(baseSlider => combineLatest([$step, $min, $max, $bounds, $isVertical, $value,
        baseSlider!.$resizeViewport.pipe(
          takeUntilDestroyed(this._destroyRef),
          startWith(null),
        ), baseSlider!.$resizeContent.pipe(
          takeUntilDestroyed(this._destroyRef),
          startWith(null),
        )]).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.updateBreakpoints();
          }),
        )),
    ).subscribe();

    const $thumbSize = toObservable(this.thumbSize);
    combineLatest([$bounds, $isVertical, $thumbSize]).pipe(
      takeUntilDestroyed(),
      tap(([bounds, isVertical, value]) => {
        const val = parseArithmeticExpression(value, isVertical ? bounds.height : bounds.width);
        this._precalculatedThumbSize.set(val);
      }),
    ).subscribe();

    combineLatest([$bounds, $isVertical, $rawScrollStartOffset]).pipe(
      takeUntilDestroyed(),
      tap(([bounds, isVertical, value]) => {
        const val = parseArithmeticExpression(value, isVertical ? bounds.height : bounds.width);
        this._precalculatedScrollStartOffset.set(val);
      }),
    ).subscribe();

    combineLatest([$bounds, $isVertical, $rawScrollEndOffset]).pipe(
      takeUntilDestroyed(),
      tap(([bounds, isVertical, value]) => {
        const val = parseArithmeticExpression(value, isVertical ? bounds.height : bounds.width);
        this._precalculatedScrollEndOffset.set(val);
      }),
    ).subscribe();

    let userAction = false;
    $baseSlider.pipe(
      takeUntilDestroyed(),
      filter(s => !!s),
      switchMap(slider => combineLatest([slider.$scroll, slider.$scrollEnd]).pipe(
        takeUntilDestroyed(this._destroyRef),
        map(([s, se]) => !!s || !!se),
        tap(v => {
          userAction = v;
        }),
      )),
    ).subscribe();

    combineLatest([$baseSlider, $init]).pipe(
      takeUntilDestroyed(),
      filter(([s, i]) => !!s && !s.grabbing && !!i),
      switchMap(() => combineLatest([
        $min, $max, $inputValue, $bounds, $isVertical]).pipe(
          takeUntilDestroyed(this._destroyRef),
          filter(([, , , b]) => !!b),
          tap(([, , v]) => {
            this.update(v, this.init, userAction);
          }),
        )),
    ).subscribe();
  }

  ngAfterViewInit() {
    this.updateBreakpoints();
    this.update(this.value(), false, true);
    this._inputValue.set(this.value());
    this._actualValue.set(this.value());
    this._$init.next(true);
  }

  private updateBreakpoints() {
    const baseSlider = this._baseSlider(), isVertical = this._isVertical(), bounds = this._bounds(), step = this.step(), min = this.min(), max = this.max();
    const steps: ISliderSteps = [],
      size = isVertical ? (bounds.height - (baseSlider!.contentElement?.offsetHeight ?? 0)) : (bounds.width - (baseSlider!.contentElement?.offsetWidth ?? 0)),
      dist = max - min,
      ns = step > max ? max : step < 0 ? 0 : step,
      stepPX = ns > 0 ? ((size * ns) / dist) : 0,
      stepLength = stepPX > 0 ? (size / stepPX) : 0;
    if (step > 0) {
      for (let i = 0, li = stepLength - 1; i < stepLength + 1; i++) {
        const s: ISliderStep = {
          id: `${i}`,
          measures: {
            x: isVertical ? 0 : (i * stepPX),
            y: isVertical ? (i * stepPX) : 0,
            maxScrollSize: 0,
          },
          config: {
            isFirst: i === 0,
            isLast: i === li - 1,
            inverted: false,
            isVertical,
          },
          bounds: {
            width: isVertical ? bounds.width : stepPX,
            height: isVertical ? stepPX : bounds.height,
          },
        };
        steps.push(s);
      }
    }
    this._service.steps = step > 0 ? steps : null;
  }

  private setupValue() {
    const baseSlider = this._baseSlider(), isVertical = this._isVertical(), bounds = this._bounds(), step = this.step(), min = this.min(), max = this.max();
    if (!!baseSlider) {
      const minSize = this._precalculatedThumbSize(),
        size = isVertical ? (bounds.height - minSize) : (bounds.width - minSize),
        scrollSize = isVertical ? baseSlider!.scrollTop : baseSlider!.scrollLeft,
        dist = max - min,
        ns = step > max ? max : step < 0 ? 0 : step,
        stepPX = ns > 0 ? ((size * ns) / dist) : 0;
      let value: number;
      if (stepPX > 0) {
        const v = (scrollSize / stepPX) * step;
        value = Math.round((min + v) / step) * step;
        this._inputValue.set(value);
      } else {
        value = min + (scrollSize * dist / size);
        this._inputValue.set(value);
      }
    }
  }

  protected calculateSliderParams(value: number) {
    const baseSlider = this._baseSlider();
    if (!baseSlider) {
      return null;
    }

    const bounds = this._bounds(),
      direction = this.direction(),
      isVertical = this._isVertical(),
      minSize = this._precalculatedThumbSize(),
      contentBounds = {
        width: isVertical ? bounds.width : bounds.width * 2,
        height: isVertical ? (bounds.height * 2) : bounds.height,
      },
      startOffset = this._precalculatedScrollStartOffset(),
      endOffset = this._precalculatedScrollEndOffset(),
      min = this.min(),
      max = this.max(),
      size = isVertical ?
        (bounds.height - (!isVertical ? bounds.height : minSize)) :
        (bounds.width - (isVertical ? bounds.width : minSize)),
      dist = (max - min),
      stepPX = size / dist;

    const v = (value - min) * stepPX,
      {
        thumbGradientPositions,
      } = this._scrollBox.calculateScroll({
        direction,
        viewportWidth: bounds.width,
        viewportHeight: bounds.height,
        contentWidth: contentBounds.width,
        contentHeight: contentBounds.height,
        startOffset,
        endOffset,
        positionX: isVertical ? baseSlider.scrollLeft : v,
        positionY: isVertical ? v : baseSlider.scrollTop,
        minSize,
      });

    return {
      size: minSize,
      position: v,
      gradientPositions: thumbGradientPositions,
    };
  }

  protected update(value: number, animated: boolean = true, userAction: boolean = true) {
    const baseSlider = this._baseSlider();
    if (!baseSlider || baseSlider.grabbing || this._animationIds !== null) {
      return;
    }
    const sliderParams = this.calculateSliderParams(value);

    if (!!sliderParams) {
      this._thumbGradientPositions.set(sliderParams.gradientPositions);
      this._size.set(sliderParams.size);
    }

    this._$update.next({
      ...sliderParams, animated: animated && !!baseSlider.contentElement?.offsetWidth &&
        !!baseSlider.contentElement?.offsetHeight, userAction,
    } as IUpdateParams);
  }

  protected onDragHandler(e: ISliderDragEvent) {
    this.onDrag.emit(e);
  }

  protected onDragEndHandler(e: ISliderDragEvent) {
    this.onDragEnd.emit(e);
  }

  /**
   * Sets the slider value.
   */
  setValue(v: number) {
    this._inputValue.set(v);
  }
}