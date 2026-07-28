import {
  ChangeDetectionStrategy, Component, computed, DestroyRef, effect, ElementRef, inject, Injector, input,
  OnDestroy, output, Signal, signal, TemplateRef, viewChild, ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, map, skip, Subject, switchMap, take, tap,
} from 'rxjs';
import {
  BEHAVIOR_INSTANT, CLASS_SCROLL_VIEW_HORIZONTAL, CLASS_SCROLL_VIEW_VERTICAL, DEFAULT_DIRECTION,
  MIN_PIXELS_FOR_PREVENT_SNAPPING, DEFAULT_LANG_TEXT_DIR, DEFAULT_SCROLLBAR_THICKNESS,
  DEFAULT_SCROLLBAR_MIN_SIZE, BEHAVIOR_AUTO, DEFAULT_SCROLLBAR_ENABLED, DEFAULT_SCROLLBAR_INTERACTIVE, DEFAULT_OVERSCROLL_ENABLED,
  DEFAULT_ANIMATION_PARAMS, DEFAULT_SCROLL_BEHAVIOR, DEFAULT_SCROLLING_SETTINGS, DEFAULT_MOTION_BLUR, DEFAULT_MAX_MOTION_BLUR,
  DEFAULT_MOTION_BLUR_ENABLED, DEFAULT_OVERLAPPING_SCROLLBAR, DEFAULT_SNAP_SCROLLTO_LEFT, DEFAULT_SNAP_SCROLLTO_TOP,
  DEFAULT_SNAP_SCROLLTO_RIGHT, DEFAULT_SNAP_SCROLLTO_BOTTOM, CLASS_SCROLL_VIEW_BOTH, DEFAULT_SCROLLABLE,
  DEFAULT_SCROLLER_SIZE,
} from './const';
import {
  IScrollEvent, IAnimationParams, IScrollingSettings, IScrollOptions,
  INtScrollViewService,
} from './interfaces';
import {
  Direction,
} from './types';
import {
  Directions,
} from './enums';
import { ScrollEvent } from './utils';
import { isDirection } from './utils/is-direction';
import { NtVirtualScrollViewService } from './nt-virtual-scroll-view.service';
import { objectAsReadonly } from '../common/utils/object';
import { NtScrollerComponent } from './components/nt-scroller/nt-scroller.component';
import { IScrollToParams } from './components/nt-scroll-view';
import {
  ArithmeticExpression, Id, ISize, SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE, SCROLL_VIEW_USER_INTERACTION_ENABLED,
  TextDirection, TextDirections,
} from '../common';
import {
  isPercentageValue, parseArithmeticExpression, toggleClassName,
  validateBoolean, validateFloat, validateInt, validateObject, validateString,
} from '../common/utils';
import { LEFT_PROP_NAME, TOP_PROP_NAME } from '../common/const/base-prop-names';
import { DEFAULT_CLICK_DISTANCE } from '../common/directives/nt-virtual-click/const';

/**
 * NtVirtualScrollViewComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-virtual-scroll-view.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
  selector: 'nt-virtual-scroll-view',
  templateUrl: './nt-virtual-scroll-view.component.html',
  styleUrl: './nt-virtual-scroll-view.component.scss',
  host: {
    'style': 'position: relative;'
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [
    { provide: SCROLL_VIEW_USER_INTERACTION_ENABLED, useValue: true },
    { provide: SCROLL_VIEW_OVERSCROLL_ENABLED, useValue: true },
    { provide: SCROLL_VIEW_SERVICE, useClass: NtVirtualScrollViewService },
  ],
})
export class NtVirtualScrollViewComponent<S extends INtScrollViewService> implements OnDestroy {
  private static __nextId: number = 0;

  protected _id: number = NtVirtualScrollViewComponent.__nextId;

  /**
   * Readonly. Returns the unique identifier of the component.
   */
  get id() { return this._id; }

  protected _service = inject<S>(SCROLL_VIEW_SERVICE);

  protected _parentService = inject<S>(SCROLL_VIEW_SERVICE, { skipSelf: true });

  protected _scrollerComponent = viewChild<NtScrollerComponent>('scroller');

  protected _scroller: Signal<ElementRef<HTMLDivElement> | undefined>;

  /**
   * Fires when the list has been scrolled.
   */
  onScroll = output<IScrollEvent>();

  /**
   * Fires when the list has completed scrolling.
   */
  onScrollEnd = output<IScrollEvent>();

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

  protected _$show = new BehaviorSubject<boolean>(false);
  readonly $show = this._$show.asObservable();

  protected _$initialized = new BehaviorSubject<boolean>(false);
  readonly $initialized = this._$initialized.asObservable();

  protected _scrollbarThickness = {
    transform: (v: number) => {
      const valid = validateInt(v);

      if (!valid) {
        console.error('The "scrollbarThickness" parameter must be of type `number`.');
        return DEFAULT_SCROLLBAR_THICKNESS;
      }
      return v;
    },
  } as any;

  /**
   * Scrollbar thickness.
   */
  scrollbarThickness = input<number>(DEFAULT_SCROLLBAR_THICKNESS, { ...this._scrollbarThickness });

  protected _scrollbarMinSize = {
    transform: (v: number) => {
      const valid = validateInt(v);

      if (!valid) {
        console.error('The "scrollbarMinSize" parameter must be of type `number`.');
        return DEFAULT_SCROLLBAR_MIN_SIZE;
      }
      return v;
    },
  } as any;

  /**
   * Minimum scrollbar size.
   */
  scrollbarMinSize = input<number>(DEFAULT_SCROLLBAR_MIN_SIZE, { ...this._scrollbarMinSize });

  protected _scrollbarThumbRenderer = {
    transform: (v: TemplateRef<any> | null) => {
      const valid = validateObject(v, true, true);

      if (!valid) {
        console.error('The "scrollbarThumbRenderer" parameter must be of type `object`.');
        return null;
      }
      return v;
    },
  } as any;

  /**
   * Scrollbar customization template.
   */
  scrollbarThumbRenderer = input<TemplateRef<any> | null>(null, { ...this._scrollbarThumbRenderer });

  protected _scrollbarThumbParams = {
    transform: (v: { [propName: string]: any } | null) => {
      const valid = validateObject(v, true, true);

      if (!valid) {
        console.error('The "scrollbarThumbParams" parameter must be of type `object`.');
        return null;
      }
      return v;
    },
  } as any;

  /**
   * Additional options for the scrollbar.
   */
  scrollbarThumbParams = input<{ [propName: string]: any } | null>({}, { ...this._scrollbarThumbParams });

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

  protected _scrollableOptions = {
    transform: (v: boolean) => {
      const valid = validateBoolean(v, true);

      if (!valid) {
        console.error('The "scrollable" parameter must be of type `boolean`.');
        return DEFAULT_SCROLLBAR_ENABLED;
      }
      return v;
    },
  } as any;

  /**
   * Determines whether scrolling is enabled or disabled. The default value is "true".
   */
  scrollable = input<boolean>(DEFAULT_SCROLLABLE, { ...this._scrollableOptions });

  protected _scrollbarEnabledOptions = {
    transform: (v: boolean) => {
      const valid = validateBoolean(v, true);

      if (!valid) {
        console.error('The "scrollbarEnabled" parameter must be of type `boolean`.');
        return DEFAULT_SCROLLBAR_ENABLED;
      }
      return v;
    },
  } as any;

  /**
   * Determines whether the scrollbar is shown or not. The default value is "true".
   */
  scrollbarEnabled = input<boolean>(DEFAULT_SCROLLBAR_ENABLED, { ...this._scrollbarEnabledOptions });

  protected _scrollbarInteractiveOptions = {
    transform: (v: boolean) => {
      const valid = validateBoolean(v, true);

      if (!valid) {
        console.error('The "scrollbarInteractive" parameter must be of type `boolean`.');
        return DEFAULT_SCROLLBAR_INTERACTIVE;
      }
      return v;
    },
  } as any;

  /**
   * Determines whether scrolling using the scrollbar will be possible. The default value is "true".
   */
  scrollbarInteractive = input<boolean>(DEFAULT_SCROLLBAR_INTERACTIVE, { ...this._scrollbarInteractiveOptions });

  protected _overlappingScrollbarOptions = {
    transform: (v: boolean) => {
      const valid = validateBoolean(v, true);

      if (!valid) {
        console.error('The "overlappingScrollbar" parameter must be of type `boolean`.');
        return DEFAULT_OVERLAPPING_SCROLLBAR;
      }
      return v;
    },
  } as any;

  /**
   * Determines whether the scroll bar will overlap the list. The default value is "false".
   */
  overlappingScrollbar = input<boolean>(DEFAULT_OVERLAPPING_SCROLLBAR, { ...this._overlappingScrollbarOptions });

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

      if (!validateFloat(v.scrollToItem)) {
        console.error('The "scrollToItem" parameter must be of type `number`.');
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

  protected _directionOptions = {
    transform: (v: Direction) => {
      const valid = validateString(v) && (v === 'horizontal' || v === 'vertical' || v === 'both');
      if (!valid) {
        console.error('The "direction" parameter must be one of `horizontal`, `vertical` or `both`.');
        return DEFAULT_DIRECTION;
      }
      return v;
    },
  } as any;

  /**
   * Determines the direction in which elements are placed. Default value is "both".
   */
  direction = input<Direction>(DEFAULT_DIRECTION, { ...this._directionOptions });

  protected _loading = {
    transform: (v: boolean) => {
      const valid = validateBoolean(v);

      if (!valid) {
        console.error('The "loading" parameter must be of type `boolean`.');
        return false;
      }
      return v;
    },
  } as any;

  /**
   * If `true`, the scrollBar goes into loading state. The default value is `false`.
   */
  loading = input<boolean>(false, { ...this._loading });

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

  protected _bounds = signal<ISize | null>(null);
  protected get bounds() { return this._bounds; }

  protected _scrollerBounds = signal<ISize | null>(null);

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

  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  get host() {
    return this._elementRef.nativeElement;
  }

  protected _$scroll = new Subject<IScrollEvent>();
  readonly $scroll = this._$scroll.asObservable();

  get $grabbing() { return this._service.$grabbing };

  private _$fireUpdate = new Subject<boolean>();
  protected readonly $fireUpdate = this._$fireUpdate.asObservable();

  private _$fireUpdateNextFrame = new Subject<boolean>();
  protected readonly $fireUpdateNextFrame = this._$fireUpdateNextFrame.asObservable();

  private _$preventScrollSnapping = new BehaviorSubject<boolean>(false);
  protected readonly $preventScrollSnapping = this._$preventScrollSnapping.asObservable();

  protected _destroyRef = inject(DestroyRef);

  private _isLoading = false;

  private _animationIds: Array<number> | null = null;

  private _$viewInit = new BehaviorSubject<boolean>(false);
  protected readonly $viewInit = this._$viewInit.asObservable();

  protected _injector = inject(Injector);

  constructor() {
    NtVirtualScrollViewComponent.__nextId = NtVirtualScrollViewComponent.__nextId + 1 === Number.MAX_SAFE_INTEGER
      ? 0 : NtVirtualScrollViewComponent.__nextId + 1;
    this._id = NtVirtualScrollViewComponent.__nextId;

    let hasUserAction = false;

    const _$created = new BehaviorSubject<boolean>(false),
      $created = _$created.asObservable();

    combineLatest([$created, this.$show]).pipe(
      takeUntilDestroyed(),
      filter(([created, shown]) => created && shown),
      debounceTime(1),
      tap(v => {
        this._$initialized.next(true);
      }),
    ).subscribe();

    this._service.initialize(this._id, this._parentService.id);

    if (!!this._parentService) {
      this._parentService.$scrollable.pipe(
        takeUntilDestroyed(),
        tap(v => {
          this._service.parentScrollable = v;
        }),
      ).subscribe();

      this._parentService.$overscroll.pipe(
        takeUntilDestroyed(),
        tap(v => {
          this._service.parentOverscroll = v;
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

    this._service.$tick.pipe(
      takeUntilDestroyed(),
      tap(() => {
        this._scrollerComponent()?.tick();
      }),
    ).subscribe();

    const $scrollerComponent = toObservable(this._scrollerComponent),
      $resizeViewport = $scrollerComponent.pipe(
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

    const $scrollbarThickness = toObservable(this.scrollbarThickness);
    $scrollbarThickness.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      tap(scrollbarThickness => {
        this._service.scrollBarSize = scrollbarThickness;
      }),
    ).subscribe();

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
      $direction = toObservable(this.direction);

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
        if (isDirection(Directions.BOTH, v)) {
          toggleClassName(el, CLASS_SCROLL_VIEW_BOTH, [CLASS_SCROLL_VIEW_HORIZONTAL, CLASS_SCROLL_VIEW_VERTICAL]);
        } else if (isDirection(Directions.HORIZONTAL, v)) {
          toggleClassName(el, CLASS_SCROLL_VIEW_HORIZONTAL, [CLASS_SCROLL_VIEW_BOTH, CLASS_SCROLL_VIEW_VERTICAL]);
        } else if (isDirection(Directions.VERTICAL, v)) {
          toggleClassName(el, CLASS_SCROLL_VIEW_VERTICAL, [CLASS_SCROLL_VIEW_BOTH, CLASS_SCROLL_VIEW_HORIZONTAL]);
        }
      }),
    ).subscribe();

    const $preventScrollSnapping = this.$preventScrollSnapping;

    $preventScrollSnapping.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      tap(() => {
        this._isScrollLeft.set(false);
        this._isScrollRight.set(false);
      }),
      tap(() => {
        this._$preventScrollSnapping.next(false);
      }),
    ).subscribe();

    const $loading = toObservable(this.loading);

    $loading.pipe(
      takeUntilDestroyed(),
      skip(1),
      distinctUntilChanged(),
      tap(v => {
        if (v) {
          this._isLoading = true;
        }
      }),
      filter(v => !v),
      tap(() => {
        this._$preventScrollSnapping.next(true);
      }),
      debounceTime(100),
      tap(() => {
        this._isLoading = false;
      }),
    ).subscribe();

    $viewInit.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      switchMap(() => {
        return combineLatest([$snapScrollToLeft, $snapScrollToRight, $snapScrollToTop, $snapScrollToBottom, $precalculatedScrollLeftOffset,
          $precalculatedScrollRightOffset, $precalculatedScrollTopOffset, $precalculatedScrollBottomOffset, $bounds, $scrollerBounds,
          $scrollLeftOffset, $scrollRightOffset, $scrollTopOffset, $scrollBottomOffset, $scrollSizeX, $scrollSizeY, $direction,
          this.$fireUpdate,
        ]).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(([
            snapScrollToLeft, snapScrollToRight, snapScrollToTop, snapScrollToBottom, precalculatedScrollLeftOffset, precalculatedScrollRightOffset,
            precalculatedScrollTopOffset, precalculatedScrollBottomOffset, bounds, scrollerBounds,
            scrollLeftOffset, scrollRightOffset, scrollTopOffset, scrollBottomOffset, scrollSizeX, scrollSizeY, direction,
          ]) => {
            const scroller = this._scrollerComponent();
            if (!!scroller) {
              const userAction = hasUserAction, ready = _$created.getValue();

              if (!_$created.getValue()) {
                _$created.next(true);
              }

              if (ready) {
                const currentScrollSizeX = scroller.scrollLeft,
                  currentScrollSizeY = scroller.scrollTop;

                this.snappingHandler();

                const roundedMaxPositionAfterUpdateX = scroller.actualScrollWidth,
                  roundedMaxPositionAfterUpdateY = scroller.actualScrollHeight;

                if (!scroller.grabbing()) {
                  return;
                }

                let toStart = false,
                  toEnd = false;

                if ((snapScrollToLeft && scroller.horizontalScrollRatio === 0 && currentScrollSizeX !== 0)) {
                  this.emitScrollEvent(true, false, userAction);

                  const params: IScrollToParams = {
                    [LEFT_PROP_NAME]: 0, userAction,
                    fireUpdate: true, behavior: (this.animationParams().scrollToItem > 0 && this.scrollBehavior() !== BEHAVIOR_INSTANT) ? BEHAVIOR_AUTO : BEHAVIOR_INSTANT,
                    blending: !!this._animationIds ? scroller.hasAnimation(...this._animationIds) : false, duration: this.animationParams().scrollToItem,
                  };
                  const animationIds = scroller?.scrollTo?.(params);
                  if (animationIds !== null) {
                    this._animationIds = animationIds;
                  } else if (this._animationIds !== null) {
                    scroller.stopAnimation(...this._animationIds);
                  }
                  toStart = true;
                }

                if ((snapScrollToTop && scroller.verticalScrollRatio === 0 && currentScrollSizeY !== 0)) {
                  this.emitScrollEvent(true, false, userAction);

                  const params: IScrollToParams = {
                    [TOP_PROP_NAME]: 0, userAction,
                    fireUpdate: true, behavior: (this.animationParams().scrollToItem > 0 && this.scrollBehavior() !== BEHAVIOR_INSTANT) ? BEHAVIOR_AUTO : BEHAVIOR_INSTANT,
                    blending: !!this._animationIds ? scroller.hasAnimation(...this._animationIds) : false, duration: this.animationParams().scrollToItem,
                  };
                  const animationIds = scroller?.scrollTo?.(params);
                  if (animationIds !== null) {
                    this._animationIds = animationIds;
                  } else if (this._animationIds !== null) {
                    scroller.stopAnimation(...this._animationIds);
                  }
                  toStart = true;
                }

                if (toStart) {
                  return;
                }

                if ((snapScrollToRight && scroller.horizontalScrollRatio === 1 && currentScrollSizeX !== roundedMaxPositionAfterUpdateX)) {

                  this.emitScrollEvent(true, false, false);

                  const params: IScrollToParams = {
                    [LEFT_PROP_NAME]: roundedMaxPositionAfterUpdateX,
                    behavior: (this.animationParams().scrollToItem > 0 && this.scrollBehavior() !== BEHAVIOR_INSTANT) ? BEHAVIOR_AUTO : BEHAVIOR_INSTANT,
                    userAction: false, blending: !!this._animationIds ? scroller.hasAnimation(...this._animationIds) : false, duration: this.animationParams().scrollToItem,
                  };
                  const animationIds = scroller?.scrollTo?.(params);
                  if (animationIds !== null) {
                    this._animationIds = animationIds;
                  } else if (this._animationIds !== null) {
                    scroller.stopAnimation(...this._animationIds);
                  }
                  toEnd = true;
                }

                if ((snapScrollToBottom && scroller.verticalScrollRatio === 1 && currentScrollSizeY !== roundedMaxPositionAfterUpdateY)) {

                  this.emitScrollEvent(true, false, false);

                  const params: IScrollToParams = {
                    [TOP_PROP_NAME]: roundedMaxPositionAfterUpdateY,
                    behavior: (this.animationParams().scrollToItem > 0 && this.scrollBehavior() !== BEHAVIOR_INSTANT) ? BEHAVIOR_AUTO : BEHAVIOR_INSTANT,
                    userAction: false, blending: !!this._animationIds ? scroller.hasAnimation(...this._animationIds) : false, duration: this.animationParams().scrollToItem,
                  };
                  const animationIds = scroller?.scrollTo?.(params);
                  if (animationIds !== null) {
                    this._animationIds = animationIds;
                  } else if (this._animationIds !== null) {
                    scroller.stopAnimation(...this._animationIds);
                  }
                  toEnd = true;
                }

                if (toEnd) {
                  return;
                }
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

        if (userAction) {
          this._$preventScrollSnapping.next(true);
        }

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
            if (userAction) {
              if (this._isScrollLeft() || this._isScrollRight() || this._isScrollTop() || this._isScrollBottom()) {
                this._$preventScrollSnapping.next(true);
              }
              this._$preventScrollSnapping.next(true);
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
  }

  ngAfterViewInit() {
    this._$viewInit.next(true);

    this._$fireUpdate.next(false);
  }

  private onAfterResize(update = false) {
    this.snappingHandler();

    if (update) {
      const scroller = this._scrollerComponent();
      if (!!scroller) {
        this._$fireUpdate.next(false);
        scroller.refresh(true, true);
      }
    }
  }

  private snappingHandler() {
    const scroller = this._scrollerComponent();
    if (!!scroller) {
      const maxScrollWidth = Math.round(scroller.scrollWidth ?? 0),
        maxScrollHeight = Math.round(scroller.scrollHeight),
        scrollWidth = scroller.scrollLeft ?? 0,
        scrollHeight = scroller.scrollTop ?? 0,
        actualScrollWidth = Math.round(scrollWidth),
        actualScrollHeight = Math.round(scrollHeight);
      if (!this._isLoading) {
        const _isScrollRight = (maxScrollWidth >= (actualScrollWidth - MIN_PIXELS_FOR_PREVENT_SNAPPING)) || !scroller.scrollableX;
        if (_isScrollRight) {
          this._isScrollLeft.set(false);
          this._isScrollRight.set(true);
        } else {
          const isScrollStart = (maxScrollWidth <= MIN_PIXELS_FOR_PREVENT_SNAPPING);
          this._isScrollLeft.set(isScrollStart);
          this._isScrollRight.set(false);
        }
        const _isScrollBottom = (maxScrollHeight >= (actualScrollHeight - MIN_PIXELS_FOR_PREVENT_SNAPPING)) || !scroller.scrollableY;
        if (_isScrollBottom) {
          this._isScrollTop.set(false);
          this._isScrollBottom.set(true);
        } else {
          const isScrollTop = (maxScrollHeight <= MIN_PIXELS_FOR_PREVENT_SNAPPING);
          this._isScrollTop.set(isScrollTop);
          this._isScrollBottom.set(false);
        }
      } else {
        const snapScrollToLeft = this.snapScrollToLeft(), snapScrollToRight = this.snapScrollToRight();
        if (!snapScrollToLeft && snapScrollToRight) {
          this._isScrollLeft.set(false);
          this._isScrollRight.set(true);
        } else if (snapScrollToLeft && snapScrollToRight) {
          this._isScrollLeft.set(true);
          this._isScrollRight.set(false);
        } else {
          this._isScrollLeft.set(false);
          this._isScrollRight.set(false);
        }
        const snapScrollToTop = this.snapScrollToTop(), snapScrollToBottom = this.snapScrollToBottom();
        if (!snapScrollToTop && snapScrollToBottom) {
          this._isScrollLeft.set(false);
          this._isScrollRight.set(true);
        } else if (snapScrollToTop && snapScrollToBottom) {
          this._isScrollLeft.set(true);
          this._isScrollRight.set(false);
        } else {
          this._isScrollLeft.set(false);
          this._isScrollRight.set(false);
        }
      }
    }
  };

  private emitScrollEvent(isScrollEnd: boolean = false, update: boolean = true, userAction: boolean = false) {
    const scrollerComponent = this._scrollerComponent();
    if (!!scrollerComponent) {
      const scrollWidth = scrollerComponent.scrollLeft,
        scrollHeight = scrollerComponent.scrollTop,
        maxScrollWidth = scrollerComponent.scrollWidth,
        maxScrollHeight = scrollerComponent.scrollHeight,
        bounds = this._bounds() || { x: 0, y: 0, width: DEFAULT_SCROLLER_SIZE, height: DEFAULT_SCROLLER_SIZE };

      const event = new ScrollEvent({
        directionX: scrollerComponent.scrollDirectionX,
        directionY: scrollerComponent.scrollDirectionY,
        bounds,
        scrollerDirection: this.direction(),
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
   * The method scrolls the scroll view and returns the animation ids if the behavior is set to smooth or null 
   * if the behavior is set to auto, instant, or not set.
   */
  scrollTo(options: IScrollOptions) {
    const behavior = options?.behavior ?? BEHAVIOR_INSTANT,
      blending = options?.blending ?? false,
      x = options?.x,
      y = options?.y,
      left = options?.left,
      top = options?.top,
      ease = options?.ease,
      duration = options?.duration;
    const scroller = this._scrollerComponent();
    if (!!scroller) {
      scroller.stopScrolling();
      return scroller.scroll({ x, y, left, top, behavior, blending, ease, duration, userAction: true });
    }
    return null;
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
