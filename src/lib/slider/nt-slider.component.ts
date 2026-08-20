import {
  Component, computed, effect, ElementRef, inject, input, output, Signal, signal, TemplateRef, viewChild, ViewEncapsulation,
} from "@angular/core";
import {
  ArithmeticExpression, GradientColorPositions, ISize, SCROLL_VIEW_INVERSION, SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO,
  SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE, SCROLL_VIEW_TYPE,
  TextDirection,
  TextDirections,
} from "../common";
import { ISliderDragEvent, NtBaseSliderComponent, NtBaseSliderPublicService } from "../../public-api";
import { DEFAULT_SIZE } from "./components/nt-base-slider/const";
import { DEFAULT_LANG_TEXT_DIR, DEFAULT_SCROLL_BEHAVIOR, DEFAULT_SCROLLBAR_INTERACTIVE } from "../common/const/scroller";
import {
  isPercentageValue, parseArithmeticExpression, toggleClassName, validateArray, validateBoolean, validateFloat, validateObject, validateString,
} from "../common/utils";
import { DEFAULT_ANIMATION_PARAMS, DEFAULT_SLIDER_DIRECTION, DEFAULT_THUMB_GRADIENT_POSITIONS } from './const';
import { IAnimationParams, INtSliderService, IScrollOptions, ISliderStep, ISliderSteps } from './interfaces';
import { BEHAVIOR_AUTO } from "../common/const/behavior";
import { IScrollToParams } from "../common/interfaces/scroll-to-params";
import { Direction } from './types';
import { Directions } from './enums';
import { LEFT_PROP_NAME, TOP_PROP_NAME } from "../common/const/base-prop-names";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { combineLatest, debounceTime, filter, tap } from "rxjs";
import { NtBaseSliderService } from "./components/nt-base-slider/nt-base-slider.service";
import { NtSliderService } from './nt-slider.service';
import { ScrollBox } from '../common/utils/scroll-box';
import { ScrollerTypes } from "../common/enums/scroller-types";

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
    { provide: SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO, useValue: false },
    { provide: SCROLL_VIEW_OVERSCROLL_ENABLED, useValue: true },
    { provide: SCROLL_VIEW_SERVICE, useClass: NtSliderService },
    NtBaseSliderService,
    NtBaseSliderPublicService,
  ],
})
export class NtSliderComponent {
  protected _baseSlider = viewChild<NtBaseSliderComponent>('baseSlider');

  /**
   * Fires a drag event.
   */
  readonly onDrag = output<ISliderDragEvent>();

  /**
   * Fires a drag end event.
   */
  readonly onDragEnd = output<ISliderDragEvent>();

  protected _directionOptions = {
    transform: (v: Direction) => {
      const valid = validateString(v) && (v === Directions.HORIZONTAL || v === Directions.VERTICAL);
      if (!valid) {
        console.error(`The "direction" parameter must be one of type \`${Directions.HORIZONTAL}\` or \`${Directions.VERTICAL}\`.`);
        return DEFAULT_SLIDER_DIRECTION;
      }
      return v;
    },
  } as any;

  /**
   * Determines the slider direction. Default value is "vertical".
   */
  direction = input<Direction>(DEFAULT_SLIDER_DIRECTION, { ...this._directionOptions });

  protected _thumbGradientPositionsOptions = {
    transform: (v: GradientColorPositions) => {
      const valid = validateArray(v) && (validateFloat(v?.[0] as number) || validateString(v?.[0] as string)) &&
        (validateFloat(v?.[1] as number) || validateString(v?.[1] as string));
      if (!valid) {
        console.error('The "thumbGradientPositions" parameter must be of type `GradientColorPositions` with a range from 0 to 1.');
        return DEFAULT_THUMB_GRADIENT_POSITIONS;
      }
      return v;
    },
  } as any;

  /**
   * Gradient fill offset boundaries. Can be specified in the range from 0 to 1 or from "0%" to "100%".
   */
  thumbGradientPositions = input<GradientColorPositions>(DEFAULT_THUMB_GRADIENT_POSITIONS, { ...this._thumbGradientPositionsOptions });

  protected _valueOptions = {
    transform: (v: number) => {
      const valid = validateFloat(v);
      if (!valid) {
        console.error('The "value" parameter must be of type `number`.');
        return 0;
      }
      return v;
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
   * Slider max value. Default max value is `0`.
   */
  max = input<number>(0, { ...this._maxOptions });

  protected _minSizeOptions = {
    transform: (v: number) => {
      const valid = validateFloat(v);
      if (!valid) {
        console.error('The "minSize" parameter must be of type `number`.');
        return 0;
      }
      return v;
    },
  } as any;

  /**
   * Slider thickness. Default value is `6`.
   */
  minSize = input<number>(0, { ...this._minSizeOptions });

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
   * Determines whether the slider will respond to user interaction or not. The default value is true.
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
        console.error('The "scrollEndOffset" parameter must be one of type `number` or `string`.');
        return 0;
      }
      return v;
    },
  } as any;

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

  protected _animationParamsOptions = {
    transform: (v: IAnimationParams) => {
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
   * Animation parameters. The default value is "{ scroll: 150 }".
   */
  animationParams = input<IAnimationParams>(DEFAULT_ANIMATION_PARAMS, { ...this._animationParamsOptions });

  /**
   * Sets the scroll end offset value. Can be specified in absolute or percentage values.
   * Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "0".
   */
  scrollEndOffset = input<ArithmeticExpression>(0, { ...this._scrollEndOffsetOptions });

  /**
   * Extra parameters that will be passed to the custom thumb renderer.
   */
  readonly params = input<{ [propName: string]: any } | null>({});

  /**
   * Custom thumb renderer.
   */
  readonly renderer = input<TemplateRef<any> | null>(null);

  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected _thumbGradientPositions = signal<GradientColorPositions>([0, 0]);

  protected _thickness = signal<number>(20);

  protected _precalculatedScrollStartOffset = signal<number>(0);

  protected _precalculatedScrollEndOffset = signal<number>(0);

  protected _snapToItem: Signal<boolean>;

  protected _actualValue: Signal<number>;

  protected _bounds = signal<ISize>({
    width: this._elementRef.nativeElement.offsetWidth,
    height: this._elementRef.nativeElement.offsetHeight,
  });

  protected _size = signal<number>(DEFAULT_SIZE);

  protected _isVertical: Signal<boolean>;

  private _scrollBox = new ScrollBox();

  private _service = inject<INtSliderService>(SCROLL_VIEW_SERVICE);

  private _animationIds: Array<number> | number | null = null;

  constructor() {
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

    this._actualValue = computed(() => {
      const v = this.value(), min = this.min(), max = this.max();
      return v < min ? min : v > max ? max : v;
    });

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
      }),
    ).subscribe();

    const $bounds = toObservable(this._bounds).pipe(
      filter(b => !!b),
    ),
      $baseSlider = toObservable(this._baseSlider),
      $isVertical = toObservable(this._isVertical),
      $rawScrollStartOffset = toObservable(this.scrollStartOffset),
      $rawScrollEndOffset = toObservable(this.scrollEndOffset),
      $value = toObservable(this._actualValue),
      $max = toObservable(this.max),
      $min = toObservable(this.min),
      $step = toObservable(this.step);

    combineLatest([$baseSlider, $step, $min, $max, $bounds, $isVertical]).pipe(
      takeUntilDestroyed(),
      filter(([baseSlider]) => !!baseSlider),
      debounceTime(0),
      tap(([baseSlider, step, min, max, bounds, isVertical]) => {
        const steps: ISliderSteps = [],
          size = isVertical ? (bounds.height - (baseSlider!.contentElement?.offsetHeight ?? 0)) : (bounds.width - (baseSlider!.contentElement?.offsetWidth ?? 0)),
          dist = max - min,
          ns = step > max ? max : step < 0 ? 0 : step,
          stepPX = ns > 0 ? ((size * ns) / dist) : 0,
          stepLength = stepPX > 0 ? (size / stepPX) : 0;
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
        this._service.steps = steps;
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

    combineLatest([$min, $max, $value, $bounds, $baseSlider, $isVertical]).pipe(
      takeUntilDestroyed(),
      filter(([, , , b, s]) => !!b && !!s),
      tap(([, , v, , baseSlider,]) => {
        if (!!baseSlider) {
          this.update(v, false);
        }
      }),
    ).subscribe();
  }

  private calculateContentRatio() {
    const min = this.min(), max = this.max(), k = min === 0 ? 0 : max / min, ak = k < 2 ? 2 : k;
    return ak;
  }

  protected calculateSliderParams(value: number) {
    const baseSlider = this._baseSlider();
    if (!baseSlider) {
      return {
        size: 0,
        position: 0,
        gradientPositions: DEFAULT_THUMB_GRADIENT_POSITIONS,
      };
    }

    const bounds = this._bounds(),
      k = this.calculateContentRatio(),
      direction = this.direction(),
      isVertical = this._isVertical(),
      viewportBounds = this._bounds(),
      contentBounds = {
        width: isVertical ? bounds.width : bounds.width * k,
        height: isVertical ? (bounds.height * k) : bounds.height,
      },
      startOffset = this._precalculatedScrollStartOffset(),
      endOffset = this._precalculatedScrollEndOffset(),
      {
        thumbSize,
        thumbPosition,
        thumbGradientPositions,
      } = this._scrollBox.calculateScroll({
        direction,
        viewportWidth: viewportBounds.width,
        viewportHeight: viewportBounds.height,
        contentWidth: contentBounds.width,
        contentHeight: contentBounds.height,
        startOffset,
        endOffset,
        positionX: isVertical ? baseSlider.scrollLeft : value,
        positionY: isVertical ? value : baseSlider.scrollTop,
        minSize: this.minSize(),
      });

    return {
      size: thumbSize,
      position: thumbPosition,
      gradientPositions: thumbGradientPositions,
    };
  }

  protected update(value: number, userAction: boolean = true) {
    const baseSlider = this._baseSlider();
    if (!baseSlider || this._animationIds !== null) {
      return;
    }
    const isVertical = this._isVertical(),
      startOffset = this._precalculatedScrollStartOffset(),
      {
        size,
        position,
        gradientPositions,
      } = this.calculateSliderParams(value);

    this._thumbGradientPositions.set(gradientPositions);
    this._size.set(size);
    const actualThumbPosition = position < startOffset ? startOffset : position;
    baseSlider.scroll({
      [isVertical ? TOP_PROP_NAME : LEFT_PROP_NAME]: actualThumbPosition, fireUpdate: true, behavior: BEHAVIOR_AUTO,
      userAction, blending: false,
    });
  }

  /**
   * The method scrolls the slider and returns the animation ids if the behavior is set to smooth or null 
   * if the behavior is set to auto, instant, or not set.
   */
  scrollTo(options?: IScrollOptions): Array<number> | number | null {
    const value = options?.value ?? 0,
      behavior = options?.behavior ?? this.behavior(),
      duration = options?.duration ?? this.animationParams().scroll,
      onUpdate = options?.onUpdate ?? null,
      onComplete = options?.onComplete ?? null;

    const slider = this._baseSlider();
    if (!!slider) {
      const isVertical = this._isVertical(),
        position = this.calculateSliderParams(value),
        params: IScrollToParams = {
          [isVertical ? TOP_PROP_NAME : LEFT_PROP_NAME]: position,
          behavior,
          duration,
          userAction: true,
          fireUpdate: true,
          blending: false,
          onUpdate,
          onComplete: data => {
            this._animationIds = null;
            if (onComplete !== null) {
              onComplete(data);
            }
          },
        };

      this._animationIds = slider.scroll(params);
      return this._animationIds;
    }

    return null;
  }

  protected onDragHandler(e: ISliderDragEvent) {
    this.onDrag.emit(e);
  }

  protected onDragEndHandler(e: ISliderDragEvent) {
    this.onDragEnd.emit(e);
  }
}