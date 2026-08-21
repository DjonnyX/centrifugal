import { Component, computed, effect, ElementRef, inject, input, output, Signal, signal, TemplateRef, viewChild } from '@angular/core';
import { combineLatest, debounceTime, filter, fromEvent, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ISliderDragEvent, ISliderTemplateContext } from './interfaces';
import {
  DEFAULT_MOTION_BLUR, DEFAULT_MAX_MOTION_BLUR, DEFAULT_SIZE, DEFAULT_THICKNESS, HEIGHT, NONE, OPACITY, OPACITY_0, OPACITY_1, PX,
  TRANSITION, TRANSITION_FADE_IN, WIDTH, DEFAULT_MOTION_BLUR_ENABLED,
} from './const';
import { NtBaseSliderService } from './nt-base-slider.service';
import { NtBaseSliderPublicService } from './nt-base-slider-public.service';
import { SliderStates } from './enums';
import {
  GradientColorPositions, SCROLL_VIEW_INVERSION, SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO, SCROLL_VIEW_OVERSCROLL_ENABLED,
  SCROLL_VIEW_TYPE, TextDirections,
} from '../../../common';
import { NtScrollView } from '../../../list';
import {
  LEFT, POSITION, POSITION_ABSOLUTE, POSITION_RELATIVE, RIGHT, TOP, BOTTOM, ZERO_PX, UNSET, SIZE_AUTO, SIZE_100_PERSENT,
} from '../../../common/const/base-prop-names';
import { ScrollerTypes } from '../../../common/enums/scroller-types';
import { DEFAULT_MAX_OVERSCROLL_EFFECT, DEFAULT_MIN_OVERSCROLL_EFFECT, DEFAULT_OVERLAPPING_SCROLLBAR, DEFAULT_SCROLLBAR_INTERACTIVE, MOTION_BLUR } from '../../../common/const/scroller';
import { POINTER_DOWN, POINTER_ENTER, POINTER_LEAVE, POINTER_UP } from '../../../common/const/event-names';
import { matrix3d } from '../../../common/utils/matrix-3d';
import { ANIMATED } from '../../../common/const/class-names';

/**
 * NtBaseSliderComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/slider/components/nt-base-slider/nt-base-slider.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
  selector: 'nt-base-slider',
  providers: [
    { provide: SCROLL_VIEW_TYPE, useValue: ScrollerTypes.SCROLL_BAR_SCROLLER },
    { provide: SCROLL_VIEW_INVERSION, useValue: true },
    { provide: SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO, useValue: false },
    { provide: SCROLL_VIEW_OVERSCROLL_ENABLED, useValue: false },
    NtBaseSliderService,
    NtBaseSliderPublicService,
  ],
  standalone: false,
  templateUrl: './nt-base-slider.component.html',
  styleUrl: './nt-base-slider.component.scss'
})
export class NtBaseSliderComponent extends NtScrollView {
  protected _defaultRenderer = viewChild<TemplateRef<any>>('defaultRenderer');

  readonly filter = viewChild<ElementRef<SVGFEGaussianBlurElement>>('filter');

  protected _sliderService = inject(NtBaseSliderService);

  private _apiService = inject(NtBaseSliderPublicService);

  readonly loading = input<boolean>(false);

  readonly onDrag = output<ISliderDragEvent>();

  readonly onDragEnd = output<ISliderDragEvent>();

  readonly thumbGradientPositions = input<GradientColorPositions>([0, 0]);

  readonly size = input<number>(DEFAULT_SIZE);

  readonly thickness = input<number>(DEFAULT_THICKNESS);

  readonly sliderMinSize = input<number>(0);

  readonly prepared = input<boolean>(false);

  readonly interactive = input<boolean>(DEFAULT_SCROLLBAR_INTERACTIVE);

  readonly overlapping = input<boolean>(DEFAULT_OVERLAPPING_SCROLLBAR);

  readonly motionBlur = input<number | 'disabled'>(DEFAULT_MOTION_BLUR);

  readonly maxMotionBlur = input<number>(DEFAULT_MAX_MOTION_BLUR);

  readonly motionBlurEnabled = input<boolean>(DEFAULT_MOTION_BLUR_ENABLED);

  readonly show = input<boolean>(false);

  readonly params = input<{ [propName: string]: any } | null>({});

  readonly renderer = input<TemplateRef<any> | null>(null);

  readonly thumbRenderer = signal<TemplateRef<any> | null>(this._defaultRenderer() ?? null);

  protected readonly hoverState = signal<boolean>(false);

  protected readonly pressedState = signal<boolean>(false);

  protected readonly templateContext!: Signal<ISliderTemplateContext>;

  protected readonly styles: Signal<{ [sName: string]: any }>;

  protected readonly thumbWidth: Signal<number>;

  protected readonly thumbHeight: Signal<number>;

  public readonly thumbStyles = signal<{ [styleName: string]: string; }>({});

  public readonly thumbClass = signal<{ [className: string]: boolean; }>({});

  private _$scrollingCancel = new Subject<void>();
  protected readonly $scrollingCancel = this._$scrollingCancel.asObservable();

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
      $isVertical = toObservable(this.isVertical),
      $overscrollEffectEvent = this.$overscrollEffectEvent,
      $resizeViewport = this.$resizeViewport;

    const $averageVelocity = this.$averageVelocity;
    combineLatest([$isVertical, $averageVelocity, $filter, $motionBlurEnabled, $motionBlur, $maxMotionBlur, $resizeViewport.pipe(
      takeUntilDestroyed(this._destroyRef),
      startWith(null),
    )]).pipe(
      takeUntilDestroyed(),
      filter(([, , f, e, mb]) => !!f && (!!e && mb !== 0)),
      debounceTime(0),
      tap(([isVertical, v, filter, , mb, mbMax]) => {
        if (this._disableAlignment) {
          this.dropVelocity();
        }
        const _v = v * (mb as number), value = _v > mbMax ? mbMax : _v;
        filter!.nativeElement.setStdDeviation(isVertical ? 0 : v * value, isVertical ? v * value : 0);
      }),
      debounceTime(50),
      tap(([, , filter, ,]) => {
        filter!.nativeElement.setStdDeviation(0, 0);
      }),
    ).subscribe();

    $overscrollEffectEvent.pipe(
      takeUntilDestroyed(),
      tap(e => {
        const langTextDir = this.langTextDir(), isRTL = langTextDir === TextDirections.RTL, tds = isRTL ? -1 : 1,
          dirX = (e.positionX === 0 ? 1 : -1), dirY = (e.positionY === 0 ? 1 : -1),
          viewportBounds = this.viewportBounds(), dx = e.dragX, dy = e.dragY,
          offsetX = dx * dirX, offsetY = dy * dirY,
          sx = viewportBounds.width !== 1 ? (dx !== 0 ? Math.pow((offsetX + viewportBounds.width) / viewportBounds.width, 0.1) : 1) : 1,
          sy = viewportBounds.height !== 0 ? (dy !== 0 ? Math.pow((offsetY + viewportBounds.height) / viewportBounds.height, 0.1) : 1) : 1,
          asx = sx > DEFAULT_MAX_OVERSCROLL_EFFECT ? DEFAULT_MAX_OVERSCROLL_EFFECT : sx < DEFAULT_MIN_OVERSCROLL_EFFECT ? DEFAULT_MIN_OVERSCROLL_EFFECT : sx,
          asy = sy > DEFAULT_MAX_OVERSCROLL_EFFECT ? DEFAULT_MAX_OVERSCROLL_EFFECT : sy < DEFAULT_MIN_OVERSCROLL_EFFECT ? DEFAULT_MIN_OVERSCROLL_EFFECT : sy,
          nasx = dirX === -1 ? asx : (2 - asx),
          nasy = dirY === -1 ? asy : (2 - asy);
        this.thumbClass.set({ [ANIMATED]: !e.grabbing && !this.context()?.component?.userActionDuringAnimation && !this.context()?.component?.grabbing });
        this.thumbStyles.set({
          transform: matrix3d(this.scrollLeft * tds, this.scrollTop, 0, nasx, nasy, 1, 0, 0, 0),
          transformOrigin: `${dirX === 1 ? RIGHT : LEFT} ${dirY === 1 ? BOTTOM : TOP}`,
        });
      }),
    ).subscribe();

    this.templateContext = computed(() => {
      const context: ISliderTemplateContext = {
        api: this._apiService,
        width: this.thumbWidth(),
        height: this.thumbHeight(),
        fillPositions: this.thumbGradientPositions(),
        params: this.params() ?? {},
      };
      return context;
    });

    const $renderer = toObservable(this.renderer).pipe(
      startWith(null),
    ),
      $defaultRenderer = toObservable(this._defaultRenderer);

    combineLatest([$renderer, $defaultRenderer]).pipe(
      takeUntilDestroyed(),
      switchMap(([renderer, defaultRenderer]) => {
        return of((renderer ?? defaultRenderer) ?? null);
      }),
      tap(v => {
        this.thumbRenderer.set(v);
      }),
    ).subscribe();

    const $prepared = toObservable(this.prepared);
    $prepared.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      tap(() => {
        this.scrollLimits();
        this.refreshCoordinate(this._x, this._y);
        this.fireScrollEvent(false);
      }),
    ).subscribe();

    this.thumbWidth = computed(() => {
      return this.isVertical() ? this.thickness() : this.size();
    });

    this.thumbHeight = computed(() => {
      return this.isVertical() ? this.size() : this.thickness();
    });

    const $wheel = this.$wheel;
    $wheel.pipe(
      takeUntilDestroyed(),
      debounceTime(100),
      tap(() => {
        const event = this.createDragEvent(true);
        if (!!event) {
          this.onDragEnd.emit(event);
        }
      }),
    ).subscribe();

    const $pointerDown = fromEvent<PointerEvent>(this._elementRef.nativeElement, POINTER_DOWN).pipe(
      takeUntilDestroyed(),
    ), $pointerUp = fromEvent<PointerEvent>(this._elementRef.nativeElement, POINTER_UP).pipe(
      takeUntilDestroyed(),
    ), $docPointerUp = fromEvent<PointerEvent>(document, POINTER_UP).pipe(
      takeUntilDestroyed()
    ), $pointerEnter = fromEvent<PointerEvent>(this._elementRef.nativeElement, POINTER_ENTER).pipe(
      takeUntilDestroyed(),
    ), $pointerLeave = fromEvent<PointerEvent>(this._elementRef.nativeElement, POINTER_LEAVE).pipe(
      takeUntilDestroyed(),
    );

    $pointerDown.pipe(
      takeUntilDestroyed(),
      tap(e => {
        this.pressedState.set(this.thumbHit(e.clientX, e.clientY));
      }),
    ).subscribe();

    combineLatest([$docPointerUp, $pointerUp]).pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.pressedState.set(false);
      }),
    ).subscribe();

    $pointerEnter.pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.hoverState.set(true);
      }),
    ).subscribe();

    $pointerLeave.pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.hoverState.set(false);
      }),
    ).subscribe();

    effect(() => {
      const pressed = this.pressedState(), hover = this.hoverState();
      if (pressed) {
        this._sliderService.state = SliderStates.PRESSED;
        return;
      } else if (hover) {
        this._sliderService.state = SliderStates.HOVER;
        return;
      }
      this._sliderService.state = SliderStates.NORMAL;
      return;
    });

    effect(() => {
      this._interactive = this.interactive();
    });

    this.styles = computed(() => {
      const show = this.show(), sizePropName = this.isVertical() ? WIDTH : HEIGHT;
      return {
        [sizePropName]: `${show ? this.thickness() : 0}${PX}`,
        [OPACITY]: show ? OPACITY_1 : OPACITY_0, [TRANSITION]: show ? TRANSITION_FADE_IN : NONE,
      };
    });

    effect(() => {
      const el = this._elementRef.nativeElement;
      if (!!el) {
        const overlapping = this.overlapping(), langTextDir = this.langTextDir(), isVertical = this.isVertical();
        el.style[POSITION] = overlapping ? POSITION_ABSOLUTE : POSITION_RELATIVE;
        el.style[LEFT] = overlapping && langTextDir === TextDirections.RTL ? ZERO_PX : UNSET;
        el.style[RIGHT] = overlapping && langTextDir === TextDirections.LTR ? ZERO_PX : UNSET;
        if (isVertical) {
          el.style[TOP] = ZERO_PX;
          el.style[WIDTH] = overlapping ? SIZE_AUTO : SIZE_100_PERSENT;
          el.style[BOTTOM] = UNSET;
        } else {
          el.style[TOP] = UNSET;
          el.style[BOTTOM] = ZERO_PX;
          el.style[HEIGHT] = overlapping ? SIZE_AUTO : SIZE_100_PERSENT;
        }
      }
    });

    effect(() => {
      const el = this.scrollContent()?.nativeElement;
      if (!!el) {
        const langTextDir = this.langTextDir(), isVertical = this.isVertical();
        if (!isVertical) {
          el.style[RIGHT] = langTextDir === TextDirections.RTL ? ZERO_PX : UNSET;
        }
      }
    });

    this.$scroll.pipe(
      takeUntilDestroyed(),
      tap(v => {
        const event = this.createDragEvent(v);
        if (!!event) {
          this.onDrag.emit(event);
        }
      }),
    ).subscribe();

    const $scrollEnd = this.$scrollEnd;
    $scrollEnd.pipe(
      takeUntilDestroyed(),
      tap(userAction => {
        const event = this.createDragEvent(userAction);
        if (!!event) {
          this.onDragEnd.emit(event);
        }
      }),
    ).subscribe();
  }

  private createDragEvent(userAction: boolean) {
    const isVertical = this.isVertical(), scrollSize = isVertical ? this.scrollHeight : this.scrollWidth,
      scrollPosition = isVertical ? this.scrollTop : this.scrollLeft,
      startOffset = this.startOffset(),
      endOffset = this.endOffset(),
      scrollContent = this.scrollContent()?.nativeElement as HTMLElement,
      scrollViewport = this.scrollViewport()?.nativeElement as HTMLDivElement;
    if (!!scrollViewport && !!scrollContent) {
      const contentSize = isVertical ? scrollContent.offsetHeight : scrollContent.offsetWidth,
        viewportSize = isVertical ? scrollViewport.offsetHeight : scrollViewport.offsetWidth,
        offsetSize = (scrollSize !== 0 ? (startOffset / scrollSize) : 0),
        positionSize = (scrollSize !== 0 ? (scrollPosition / scrollSize) : 0),
        maxSize = 1 - offsetSize,
        pos = (positionSize - offsetSize);
      const event: ISliderDragEvent = {
        position: pos / maxSize,
        min: scrollSize !== 0 ? (startOffset / scrollSize) : 0,
        max: scrollSize !== 0 ? ((viewportSize - endOffset - contentSize) / scrollSize) : 0,
        animation: !this._isMoving,
        isVertical,
        userAction,
      };
      return event;
    }
    return null;
  }

  private thumbHit(x: number, y: number): boolean {
    const thumb = this.scrollContent()?.nativeElement;
    if (!!thumb) {
      const { x: tX, y: tY, width: tWidth, height: tHeight } = thumb.getBoundingClientRect();
      if ((x >= tX && x <= tX + tWidth) && (y >= tY && y <= tY + tHeight)) {
        return true;
      }
    }
    return false;
  }

  click(event: PointerEvent | MouseEvent) {
    this._sliderService.click(event);
  }
}
