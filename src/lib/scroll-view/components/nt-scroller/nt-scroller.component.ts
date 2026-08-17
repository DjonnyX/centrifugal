import { Component, computed, effect, ElementRef, input, output, Signal, signal, TemplateRef, viewChild, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, filter, Subject, tap } from 'rxjs';
import { ScrollBox } from './utils';
import { SCROLLER_SCROLL } from '../../const';
import { NtScrollView } from '../nt-scroll-view';
import {
  GradientColorPositions, Id, ISize, SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO, SCROLL_VIEW_INVERSION, SCROLL_VIEW_TYPE,
  Directions,
} from '../../../common';
import { NtBaseSliderComponent } from '../../../slider/components/nt-base-slider/nt-base-slider.component';
import { BOTTOM, LEFT_PROP_NAME, PX, RIGHT, SCALE, TOP_PROP_NAME } from '../../../common/const/base-prop-names';
import { ISliderDragEvent } from '../../../slider/components/nt-base-slider/interfaces';
import { IScrollToParams } from '../../../common/interfaces/scroll-to-params';
import { ScrollerTypes } from '../../../common/enums/scroller-types';
import { BEHAVIOR_INSTANT } from '../../../common/const/behavior';
import {
  DEFAULT_MAX_MOTION_BLUR, DEFAULT_MAX_OVERSCROLL_EFFECT, DEFAULT_MOTION_BLUR, DEFAULT_MOTION_BLUR_ENABLED, DEFAULT_OVERLAPPING_SCROLLBAR, DEFAULT_SCROLLBAR_ENABLED,
  DEFAULT_SCROLLBAR_INTERACTIVE, DEFAULT_SCROLLBAR_MIN_SIZE, DEFAULT_SCROLLBAR_THICKNESS,
} from '../../../common/const/scroller';
import { ANIMATED } from '../../../common/const/class-names';

const TOP = 'top',
  LEFT = 'left',
  INSTANT = 'instant',
  MOTION_BLUR = 'motion-blur',
  FULL_SIZE = 'full-size';

export const SCROLL_EVENT = new Event(SCROLLER_SCROLL);

/**
 * The scroller for the NtScrollView item component
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/scroller/nt-scroller.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
  selector: 'nt-scroller',
  providers: [
    { provide: SCROLL_VIEW_TYPE, useValue: ScrollerTypes.SCROLL_VIEW_SCROLLER },
    { provide: SCROLL_VIEW_INVERSION, useValue: false },
    { provide: SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO, useValue: true },
  ],
  standalone: false,
  templateUrl: './nt-scroller.component.html',
  styleUrl: './nt-scroller.component.scss'
})
export class NtScrollerComponent extends NtScrollView {
  @ViewChild('scrollBarHorizontal', { read: NtBaseSliderComponent })
  readonly scrollBarHorizontal: NtBaseSliderComponent | undefined;

  @ViewChild('scrollBarVertical', { read: NtBaseSliderComponent })
  readonly scrollBarVertical: NtBaseSliderComponent | undefined;

  readonly filter = viewChild<ElementRef<SVGFEGaussianBlurElement>>('filter');

  readonly onScrollbarVisible = output<boolean>();

  readonly fullSize = input<boolean>(false);

  readonly scrollbarEnabled = input<boolean>(DEFAULT_SCROLLBAR_ENABLED);

  readonly scrollbarInteractive = input<boolean>(DEFAULT_SCROLLBAR_INTERACTIVE);

  readonly focusedElement = input<Id | null>(null);

  readonly overlappingScrollbar = input<boolean>(DEFAULT_OVERLAPPING_SCROLLBAR);

  readonly content = input<HTMLElement>();

  readonly loading = input<boolean>(false);

  readonly classes = input<{ [cName: string]: boolean }>({});

  readonly scrollbarMinSize = input<number>(DEFAULT_SCROLLBAR_MIN_SIZE);

  readonly scrollbarThickness = input<number>(DEFAULT_SCROLLBAR_THICKNESS);

  readonly scrollbarThumbRenderer = input<TemplateRef<any> | null>(null);

  readonly scrollbarThumbParams = input<{ [propName: string]: any } | null>(null);

  readonly motionBlur = input<number | 'disabled'>(DEFAULT_MOTION_BLUR);

  readonly maxMotionBlur = input<number>(DEFAULT_MAX_MOTION_BLUR);

  readonly motionBlurEnabled = input<boolean>(DEFAULT_MOTION_BLUR_ENABLED);

  public readonly actualClasses: Signal<{ [cName: string]: boolean }>;

  public readonly containerClasses: Signal<{ [cName: string]: boolean }>;

  public readonly thumbGradientPositionsHorizontal = signal<GradientColorPositions>([0, 0]);

  public readonly thumbGradientPositionsVertical = signal<GradientColorPositions>([0, 0]);

  public readonly thumbSizeVertical = signal<number>(0);

  public readonly thumbSizeHorizontal = signal<number>(0);

  public readonly scrollbarHorizontalEnabled = signal<boolean>(this.scrollableX);

  public readonly scrollbarVerticalEnabled = signal<boolean>(this.scrollableY);

  public readonly preparedSignal = signal<boolean>(false);

  public readonly listStyles = signal<{ perspectiveOrigin: string }>({ perspectiveOrigin: 'center' });

  public readonly wrapperStyles = signal<{ [styleName: string]: string; }>({});

  public readonly wrapperClass = signal<{ [className: string]: boolean; }>({});

  private _scrollBox = new ScrollBox();

  get host() {
    return this.scrollViewport()?.nativeElement;
  }

  private _$scrollbarScroll = new Subject<boolean>();
  readonly $scrollbarScroll = this._$scrollbarScroll.asObservable();

  private _prepared = false;
  set prepared(v: boolean) {
    if (this._prepared !== v) {
      this._prepared = v;
      this.preparedSignal.set(v);
    }
  }

  protected override setX(x: number, normalize: boolean = true) {
    if (x !== undefined && !Number.isNaN(x)) {
      this.updateDirectionX(x, this._x);

      this._x = this._actualX = x;

      const overridden = normalize ? this.normalizeScrollSize() : false;

      this.refreshCoordinate(this._x, this._y);

      if (!overridden) {
        this.measureVelocity();
      }

      this.updateScrollBar(false);

      this.recalculatePerspective();
    }
  }

  protected override setY(y: number, normalize: boolean = true) {
    if (y !== undefined && !Number.isNaN(y)) {
      this.updateDirectionY(y, this._y);

      this._y = this._actualY = y;

      const overridden = normalize ? this.normalizeScrollSize() : false;

      this.refreshCoordinate(this._x, this._y);

      if (!overridden) {
        this.measureVelocity();
      }

      this.updateScrollBar(true);

      this.recalculatePerspective();
    }
  }

  override set startLayoutOffsetX(v: number) {
    if (this._startLayoutOffsetX !== v) {
      this._startLayoutOffsetX = v;

      this.refreshCoordinate(this._x, this._y);

      this.recalculatePerspective();
    }
  }
  override get startLayoutOffsetX() { return this._startLayoutOffsetX; }

  override set startLayoutOffsetY(v: number) {
    if (this._startLayoutOffsetY !== v) {
      this._startLayoutOffsetY = v;

      this.refreshCoordinate(this._x, this._y);

      this.recalculatePerspective();
    }
  }
  override get startLayoutOffsetY() { return this._startLayoutOffsetY; }

  readonly viewInitialized = signal<boolean>(false);

  private _isScrollbarUserActionX: boolean = false;
  get isScrollbarUserActionX() {
    return this._isScrollbarUserActionX;
  }

  private _isScrollbarUserActionY: boolean = false;
  get isScrollbarUserActionY() {
    return this._isScrollbarUserActionY;
  }

  protected _filterId: string;

  protected _filter: string;

  constructor() {
    super();

    this._filterId = `${this._service.id}-${MOTION_BLUR}`;
    this._filter = `url(#${this._filterId})`;

    const $filter = toObservable(this.filter),
      $motionBlur = toObservable(this.motionBlur),
      $maxMotionBlur = toObservable(this.maxMotionBlur),
      $motionBlurEnabled = toObservable(this.motionBlurEnabled),
      $scrollContent = toObservable(this.scrollContent),
      $overscrollEffectEvent = this.$overscrollEffectEvent,
      $resizeViewport = this.$resizeViewport;

    $resizeViewport.pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.resetDrag();
        this.emitOverscrollEffectEvent(false);
      }),
    ).subscribe();

    combineLatest([$overscrollEffectEvent, this.$resizeViewport]).pipe(
      takeUntilDestroyed(),
      tap(([e, viewportBounds]) => {
        const dx = e.dragX, dy = e.dragY, sx = viewportBounds.width !== 1 ? (dx !== 0 ? Math.pow((dx + viewportBounds.width) / viewportBounds.width, 0.1) : 1) : 1,
          sy = viewportBounds.height !== 0 ? (dy !== 0 ? Math.pow((dy + viewportBounds.height) / viewportBounds.height, 0.1) : 1) : 1;
        this.wrapperClass.set({ [ANIMATED]: !e.grabbing });
        this.wrapperStyles.set({
          transform: `${SCALE}(${sx > DEFAULT_MAX_OVERSCROLL_EFFECT ? DEFAULT_MAX_OVERSCROLL_EFFECT : sx}, ${sy > DEFAULT_MAX_OVERSCROLL_EFFECT ? DEFAULT_MAX_OVERSCROLL_EFFECT : sy})`,
          transformOrigin: `${e.positionX === 1 ? RIGHT : LEFT} ${e.positionY === 1 ? BOTTOM : TOP}`,
        });
      }),
    ).subscribe();

    $scrollContent.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      tap(v => {
        this._controlContainerService.focus({
          element: v.nativeElement, ngControl: null,
          scroller: this, type: this._type, id: this._service.id,
        });
      }),
    ).subscribe();

    const $scrollbarScroll = this.$scrollbarScroll;
    $scrollbarScroll.pipe(
      takeUntilDestroyed(),
      debounceTime(50),
      tap(() => {
        this.dropVelocity();
        this.fireScrollEvent(false);
      }),
    ).subscribe();

    const $averageVelocityX = this.$averageVelocityX,
      $averageVelocityY = this.$averageVelocityY;
    combineLatest([$averageVelocityX, $averageVelocityY, $filter, $motionBlurEnabled, $motionBlur, $maxMotionBlur]).pipe(
      takeUntilDestroyed(),
      filter(([, , , f, e, mb]) => !!f && (!!e && mb !== 0)),
      debounceTime(0),
      tap(([x, y, filter, , mb, mbMax]) => {
        const _x = x * (mb as number), valueX = _x > mbMax ? mbMax : _x,
          _y = y * (mb as number), valueY = _y > mbMax ? mbMax : _y;
        filter!.nativeElement.setStdDeviation(x * valueX, y * valueY);
      }),
      debounceTime(50),
      tap(([, , filter, ,]) => {
        filter!.nativeElement.setStdDeviation(0, 0);
      }),
    ).subscribe();

    const $prepare = toObservable(this.preparedSignal);
    $prepare.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      tap(() => {
        this.updateScrollBarHandler(false, true, false, true);
        this.updateScrollBarHandler(true, true, false, true);
      }),
    ).subscribe();

    const $leftOffset = toObservable(this.leftOffset),
      $rightOffset = toObservable(this.rightOffset),
      $topOffset = toObservable(this.topOffset),
      $bottomOffset = toObservable(this.bottomOffset),
      $scrollbarMinSize = toObservable(this.scrollbarMinSize),
      $thumbSizeHorizontal = toObservable(this.thumbSizeHorizontal),
      $thumbSizeVertical = toObservable(this.thumbSizeVertical);

    combineLatest([$rightOffset, $leftOffset, $thumbSizeHorizontal, $scrollbarMinSize]).pipe(
      takeUntilDestroyed(),
      debounceTime(0),
      tap(() => {
        this.updateScrollBar(false);
      }),
    ).subscribe();

    combineLatest([$bottomOffset, $topOffset, $thumbSizeVertical, $scrollbarMinSize]).pipe(
      takeUntilDestroyed(),
      debounceTime(0),
      tap(() => {
        this.updateScrollBar(true);
      }),
    ).subscribe();

    const $updateScrollBarHorizontal = this.$updateScrollBarHorizontal,
      $updateScrollBarVertical = this.$updateScrollBarVertical;

    $updateScrollBarHorizontal.pipe(
      takeUntilDestroyed(this._destroyRef),
      debounceTime(0),
      tap(() => {
        this.updateScrollBarHandler(false, !this._isScrollbarUserActionX);
      }),
    ).subscribe();

    $updateScrollBarVertical.pipe(
      takeUntilDestroyed(this._destroyRef),
      debounceTime(0),
      tap(() => {
        this.updateScrollBarHandler(true, !this._isScrollbarUserActionY);
      }),
    ).subscribe();

    effect(() => {
      const grabbing = this.grabbing();
      this._service.grabbing = grabbing;
    });

    this.actualClasses = computed(() => {
      const classes = this.classes(), direction = this.direction(), filtered = this.motionBlurEnabled(), fullSize = this.fullSize();
      return { ...classes, [direction]: true, grabbing: this.grabbing(), filtered, [FULL_SIZE]: fullSize };
    });

    this.containerClasses = computed(() => {
      const { width: contentWidth, height: contentHeight } = this.contentBounds(),
        scrollEnabled = this.scrollable(),
        { width, height } = this.viewportBounds(),
        overlappingScrollbar = this.overlappingScrollbar(),
        viewportWidth = width,
        viewportHeight = height,
        scrollableX = contentWidth > viewportWidth,
        scrollableY = contentHeight > viewportHeight,
        scrollable = scrollEnabled && (scrollableX || scrollableY);
      return {
        [this.direction()]: true, grabbing: this.grabbing(), enabled: this.scrollbarEnabled(),
        scrollable, scrollableX, scrollableY, overlapping: overlappingScrollbar,
      };
    });

    effect(() => {
      const viewInitialized = this.viewInitialized();
      if (viewInitialized) {
        this.updateScrollBarHandler(false);
        this.updateScrollBarHandler(true);
      }
    });
  }

  private recalculatePerspective() {
    const scrollWidth = this.scrollLeft - this._startLayoutOffsetX,
      scrollHeight = this.scrollTop - this._startLayoutOffsetX,
      { width, height } = this.viewportBounds();
    this.listStyles.set({
      perspectiveOrigin: `${scrollWidth + width * .5}${PX} ${scrollHeight + height * .5}${PX}`
    });
  }

  protected override onResizeViewport() {
    const viewport = this.scrollViewport()?.nativeElement;
    if (!!viewport) {
      const bounds: ISize = { width: viewport.offsetWidth, height: viewport.offsetHeight }, b = this.viewportBounds();
      if (bounds.width === b.width && bounds.height === b.height) {
        return;
      }
      this.viewportBounds.set(bounds);
      this.updateScrollBar(false);
      this.updateScrollBar(true);
      this.dropVelocity();
      this._$resizeViewport.next(bounds);
    }
  }

  protected override onResizeContent(width: number | null = null, height: number | null = null) {
    const content = this.scrollContent()?.nativeElement;
    if (!!content) {
      const bounds: ISize = {
        width: width ?? content.offsetWidth,
        height: height ?? content.offsetHeight,
      }, b = this.contentBounds();
      if (width === null && height === null && bounds.width === b.width && bounds.height === b.height) {
        return;
      }
      this.contentBounds.set(bounds);
      this.updateScrollBar(false);
      this.updateScrollBar(true);
      this._$resizeContent.next(bounds);
    }
  }

  private updateScrollBarHandler(isVertical: boolean, update: boolean = false, blending: boolean = true, fireUpdate: boolean = false) {
    const viewportBounds = this.viewportBounds(),
      direction = this.direction(),
      horizontalEnabled = direction === Directions.BOTH || direction === Directions.HORIZONTAL,
      verticalEnabled = direction === Directions.BOTH || direction === Directions.VERTICAL;
    if ((isVertical && verticalEnabled) || (!isVertical && horizontalEnabled)) {
      const contentBounds = this.contentBounds(),
        startOffset = isVertical ? this.topOffset() : this.leftOffset(),
        endOffset = isVertical ? this.bottomOffset() : this.rightOffset(),
        {
          thumbSize,
          thumbPosition,
          thumbGradientPositions,
        } = this._scrollBox.calculateScroll({
          direction: isVertical ? Directions.VERTICAL : Directions.HORIZONTAL,
          viewportWidth: viewportBounds.width,
          viewportHeight: viewportBounds.height,
          contentWidth: contentBounds.width,
          contentHeight: contentBounds.height,
          startOffset,
          endOffset,
          positionX: this._x,
          positionY: this._y,
          minSize: this.scrollbarMinSize(),
        });

      if (isVertical) {
        this.thumbGradientPositionsVertical.set(thumbGradientPositions);
        this.thumbSizeVertical.set(thumbSize);
      } else {
        this.thumbGradientPositionsHorizontal.set(thumbGradientPositions);
        this.thumbSizeHorizontal.set(thumbSize);
      }
      const actualThumbPosition = thumbPosition < startOffset ? startOffset : thumbPosition;
      if (update) {
        (isVertical ? this.scrollBarVertical : this.scrollBarHorizontal)?.scroll({
          [isVertical ? TOP_PROP_NAME : LEFT_PROP_NAME]: actualThumbPosition, fireUpdate, behavior: BEHAVIOR_INSTANT,
          userAction: false, blending,
        });
      }
    }

    if (isVertical) {
      this.scrollbarVerticalEnabled.set(verticalEnabled && this.scrollableY && this.scrollbarEnabled());
    } else {
      this.scrollbarHorizontalEnabled.set(horizontalEnabled && this.scrollableX && this.scrollbarEnabled());
    }
  };

  ngAfterViewInit() {
    this.viewInitialized.set(true);
  }

  override tick() {
    super.tick();

    this.scrollBarHorizontal?.tick();
    this.scrollBarVertical?.tick();
  }

  private updateScrollBar(isVertical: boolean) {
    (isVertical ? this._$updateScrollBarVertical : this._$updateScrollBarHorizontal).next();
  }

  protected override normalizeScrollWidth() {
    const result = super.normalizeScrollWidth();
    this.scrollLimits();
    this.measureVelocity();
    return result;
  }

  protected override normalizeScrollHeight() {
    const result = super.normalizeScrollHeight();
    this.scrollLimits();
    this.measureVelocity();
    return result;
  }

  refreshScrollbar() {
    this.updateScrollBarHandler(true, true, false, false);
    this.updateScrollBarHandler(false, true, false, false);
  }

  protected onDragStartHorizontal() {
    this.onDragStart();

    this.stopScrollbar(false);

    this._isScrollbarUserActionX = false;

    this.updateScrollBar(false);
  }

  protected onDragStartVertical() {
    this.onDragStart();

    this.stopScrollbar(true);

    this._isScrollbarUserActionY = false;

    this.updateScrollBar(true);
  }

  override reset() {
    super.reset();
    this.totalWidth = this.totalHeight = 0;
    this.onResizeContent(0, 0);
    this.stopScrollbar(false);
    this.stopScrollbar(true);
    this.refresh(true, true);
    this.resetDrag();
    this.emitOverscrollEvent(true, false);
    this.prepared = false;
  }

  refresh(fireUpdate: boolean = false, updateScrollbar: boolean = true) {
    this.scrollLimits();

    this.refreshCoordinate(this._x, this._y);

    if (updateScrollbar) {
      this.updateScrollBarHandler(true, false);
      this.updateScrollBarHandler(false, false);
      this.emitScrollableEvent();
    }

    if (fireUpdate) {
      this.fireScrollEvent(false);
    }
  }

  startScrollTo() {
    this.stopScrollbar(false);
    this.stopScrollbar(true);
    this.stopScrolling();
    this.scrollDirectionX = this.scrollDirectionY = 0;
    this.dropVelocity();
    this._isScrollsTo = true;
  }

  finishedScrollTo() {
    this._isScrollsTo = false;
    this.scrollDirectionX = this.scrollDirectionY = 0;
    this.dropVelocity();
    this.fireScrollEvent(true);
  }

  scrollTo(params: IScrollToParams): Array<number> | null {
    const userAction = params?.userAction ?? true;
    if (userAction) {
      this._isScrollbarUserActionX = this._isScrollbarUserActionY = false;
      this.scrollBarHorizontal?.stopScrolling();
      this.scrollBarVertical?.stopScrolling();
    }
    return this.scroll({ ...params, userAction: userAction });
  }

  stopScrollbar(isVertical: boolean) {
    const scrollBar = isVertical ? this.scrollBarVertical : this.scrollBarHorizontal;
    if (!!scrollBar) {
      scrollBar.stopScrolling();
      this.dropVelocity();
    }
  }

  protected override dropVelocity() {
    super.dropVelocity();
    this._velocitiesX = [0];
    this._$velocityX.next(0);
    this._$averageVelocityX.next(0);

    this._velocitiesY = [0];
    this._$velocityY.next(0);
    this._$averageVelocityY.next(0);
  }

  protected override stopMoving() {
    super.stopMoving();
    this.dropVelocity();
  }

  protected override onAnimationComplete(position: number) {
    this.dropVelocity();
    this._$scrollEnd.next(false);
  }

  onScrollBarDragHandler(event: ISliderDragEvent) {
    const { position, isVertical, min, max, userAction } = event;
    if (isVertical) {
      this._isScrollbarUserActionY = userAction;
    } else {
      this._isScrollbarUserActionX = userAction;
    }
    if (!userAction) {
      return;
    }
    this._$scrollbarScroll.next(true);
    this.stopScrolling();
    const {
      position: absolutePosition,
    } = this._scrollBox.getScrollPositionByScrollBar({
      scrollSize: isVertical ? this.scrollHeight : this.scrollWidth,
      position,
    });

    this.scrollTo({
      [isVertical ? TOP : LEFT]: absolutePosition, behavior: INSTANT,
      blending: false, userAction: true, fireUpdate: true,
    });
    this.emitScrollableEvent();
    this._service.update(false);
  }

  protected onScrollBarDragEndHandler(event: ISliderDragEvent) {
    const { position, min, max, isVertical, userAction } = event;
    if (isVertical) {
      this._isScrollbarUserActionY = userAction;
    } else {
      this._isScrollbarUserActionX = userAction;
    }
    if (!userAction) {
      return;
    }
    if (isVertical) {
      this._isScrollbarUserActionY = false;
    } else {
      this._isScrollbarUserActionX = false;
    }
    this.dropVelocity();
    this._service.update(false);
    this.fireUpdateIfEdgesDetected(isVertical, position, min, max, true, true);
    if (isVertical) {
      this.scrollDirectionY = 0;
    } else {
      this.scrollDirectionX = 0;
    }
    this._$scrollbarScroll.next(true);
    this.fireScrollEvent(true);
  }

  private fireUpdateIfEdgesDetected(isVertical: boolean, position: number, min: number = 0, max: number = 1, animation: boolean = false, userAction: boolean = false) {
    if (userAction && animation) {
      if (position <= min) {
        if (isVertical) {
          this._service.scrollToTop();
        } else {
          this._service.scrollToLeft();
        }
        return true;
      } else if (position >= max) {
        if (isVertical) {
          this._service.scrollToBottom();
        } else {
          this._service.scrollToRight();
        }
        return true;
      }
    }
    return false;
  }
}