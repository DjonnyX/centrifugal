import { ChangeDetectionStrategy, Component, computed, input, output, Signal, signal, TemplateRef, ViewEncapsulation } from "@angular/core";
import { INtScrollViewService, NtScrollViewComponent } from "../scroll-view";
import {
  ArithmeticExpression, IPoint, IScrollOptions, SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE, SCROLL_VIEW_TYPE,
  SCROLL_VIEW_USER_INTERACTION_ENABLED, SnappingDistance, TextDirection, TextDirections,
} from "../common";
import { isPercentageValue, parseArithmeticExpression, validateBoolean, validateFloat, validateObject, validateString } from "../common/utils";
import { DEFAULT_ANIMATION_PARAMS, DEFAULT_BACKDROP, DEFAULT_DOCK_SIZE, DEFAULT_SNAPPING_DISTANCE } from "./const";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { BehaviorSubject, combineLatest, debounceTime, filter, map, startWith, Subject, switchMap, tap } from "rxjs";
import { IDrawerBreakpoint, IDrawerBreakpoints, INtDrawerAnimationParams, INtDrawerService } from "./interfaces";
import { NtDrawerService } from './nt-drawer.service';
import { DrawerDockPositions } from './enums';
import { DrawerDockPosition } from './types';
import { ScrollerTypes } from "../common/enums/scroller-types";
import { BEHAVIOR_INSTANT } from "../common/const/behavior";

/**
 * NtDrawerComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/drawer/nt-drawer.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
  selector: 'nt-drawer',
  templateUrl: './nt-drawer.component.html',
  styleUrl: './nt-drawer.component.scss',
  host: {
    'style': 'position: relative; display: block; width: 100%; height: 100%;'
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [
    { provide: SCROLL_VIEW_TYPE, useValue: ScrollerTypes.DRAWER },
    { provide: SCROLL_VIEW_USER_INTERACTION_ENABLED, useValue: true },
    { provide: SCROLL_VIEW_OVERSCROLL_ENABLED, useValue: true },
    { provide: SCROLL_VIEW_SERVICE, useClass: NtDrawerService },
  ],
})
export class NtDrawerComponent extends NtScrollViewComponent<INtDrawerService, INtScrollViewService> {
  /**
   * Triggered when the drawer is opened.
   */
  onOpen = output<DrawerDockPosition>();

  /**
   * Triggered when the drawer is closed.
   */
  onClose = output<void>();

  protected override _snapScrollToLeftOptions = {
    transform: (v: boolean) => {
      console.error('The "snapScrollToLeft" property is not available.');
      return false;
    },
  } as any;

  /**
   * @deprecated
   */
  override snapScrollToLeft = input<boolean>(false, { ...this._snapScrollToLeftOptions });

  protected override _snapScrollToTopOptions = {
    transform: (v: boolean) => {
      console.error('The "snapScrollToTop" property is not available.');
      return false;
    },
  } as any;

  /**
   * @deprecated
   */
  override snapScrollToTop = input<boolean>(false, { ...this._snapScrollToTopOptions });

  protected override _snapScrollToRightOptions = {
    transform: (v: boolean) => {
      console.error('The "snapScrollToRight" property is not available.');
      return false;
    },
  } as any;

  /**
   * @deprecated
   */
  override snapScrollToRight = input<boolean>(false, { ...this._snapScrollToRightOptions });

  protected override _snapScrollToBottomOptions = {
    transform: (v: boolean) => {
      console.error('The "snapScrollToBottom" property is not available.');
      return false;
    },
  } as any;

  /**
   * @deprecated
   */
  override snapScrollToBottom = input<boolean>(false, { ...this._snapScrollToBottomOptions });

  protected override _scrollableOptions = {
    transform: (v: boolean) => {
      console.error('The "scrollable" property is not available.');
      return true;
    },
  } as any;

  /**
   * @deprecated
   */
  override scrollable = input<boolean>(true, { ...this._scrollableOptions });

  protected override _overscrollAreaShowAutomaticallyOptions = {
    transform: (v: boolean) => {
      console.error('The "overscrollAreaShowAutomatically" property is not available.');
      return false;
    },
  } as any;

  /**
     * @deprecated
   *  Sets whether overscroll areas are automatically displayed if the value is true.
   */
  override overscrollAreaShowAutomatically = input<boolean>(false, { ...this._overscrollAreaShowAutomaticallyOptions });

  protected override _scrollbarThickness = {
    transform: (v: number) => {
      console.error('The "scrollbarThickness" property is not available.');
      return 0;
    },
  } as any;

  /**
   * @deprecated
   * The `scrollbarThickness` property is not available for the control container.
   */
  override scrollbarThickness = input<number>(0, { ...this._scrollbarThickness });

  protected override _scrollbarMinSize = {
    transform: (v: number) => {
      console.error('The "scrollbarMinSize" property is not available.');
      return 0;
    },
  } as any;

  /**
   * @deprecated
   * The `scrollbarMinSize` property is not available for the control container.
   */
  override scrollbarMinSize = input<number>(0, { ...this._scrollbarMinSize });

  protected override _scrollbarThumbRenderer = {
    transform: (v: any) => {
      console.error('The "scrollbarThumbRenderer" property is not available.');
      return null;
    },
  } as any;

  /**
   * @deprecated
   * The `scrollbarThumbRenderer` property is not available for the control container.
   */
  override scrollbarThumbRenderer = input<TemplateRef<any> | null>(null, { ...this._scrollbarThumbRenderer });

  protected override _scrollbarThumbParams = {
    transform: (v: { [propName: string]: any } | null) => {
      console.error('The "scrollbarThumbParams" property is not available.');
      return null;
    },
  } as any;

  /**
   * @deprecated
   * The `scrollbarThumbParams` property is not available for the control container.
   */
  override scrollbarThumbParams = input<{ [propName: string]: any } | null>({}, { ...this._scrollbarThumbParams });

  protected override _scrollbarEnabledOptions = {
    transform: (v: boolean) => {
      console.error('The "scrollbarEnabled" property is not available.');
      return false;
    },
  } as any;

  /**
   * @deprecated
   * The `scrollbarEnabled` property is not available for the control container.
   */
  override scrollbarEnabled = input<boolean>(false, { ...this._scrollbarEnabledOptions });

  protected override _scrollbarInteractiveOptions = {
    transform: (v: boolean) => {
      console.error('The "scrollbarInteractive" property is not available.');
      return false;
    },
  } as any;

  /**
   * @deprecated
   * The `scrollbarInteractive` property is not available for the control container.
   */
  override scrollbarInteractive = input<boolean>(false, { ...this._scrollbarInteractiveOptions });

  protected override _overlappingScrollbarOptions = {
    transform: (v: boolean) => {
      console.error('The "overlappingScrollbar" property is not available.');
      return false;
    },
  } as any;

  /**
   * @deprecated
   * The `overlappingScrollbar` property is not available for the control container.
   */
  override overlappingScrollbar = input<boolean>(false, { ...this._overlappingScrollbarOptions });

  protected override _langTextDir = {
    transform: (v: TextDirection) => {
      console.error('The "langTextDir" property is not available.');
      return TextDirections.LTR;
    },
  } as any;

  /**
   * @deprecated
   * The `overlappingScrollbar` property is not available for the control container.
   */
  override langTextDir = input<TextDirection>(TextDirections.LTR, { ...this._langTextDir });

  protected _backdropOptions = {
    transform: (v: boolean) => {
      const valid = validateBoolean(v);
      if (!valid) {
        console.error('The "backdrop" parameter must be of type `boolean`.');
        return DEFAULT_BACKDROP;
      }
      return v;
    },
  } as any;

  /**
   * Determines whether the content will be covered by an overlay when clicked to close the dock. Default value is `true`.
   */
  backdrop = input<boolean>(DEFAULT_BACKDROP, { ...this._backdropOptions });

  protected _dockLeftSizeOptions = {
    transform: (v: number) => {
      const valid = validateFloat(v, true) || isPercentageValue(v);
      if (!valid) {
        console.error('The "dockLeftSize" parameter must be one of type `number` or `string`.');
        return DEFAULT_DOCK_SIZE;
      }
      return v;
    },
  } as any;

  /**
   * Sets the dock left size. Can be specified in absolute or percentage values.
   * Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "100%".
   */
  dockLeftSize = input<ArithmeticExpression>(DEFAULT_DOCK_SIZE, { ...this._dockLeftSizeOptions });

  protected _dockTopSizeOptions = {
    transform: (v: number) => {
      const valid = validateFloat(v, true) || isPercentageValue(v);
      if (!valid) {
        console.error('The "dockTopSize" parameter must be one of type `number` or `string`.');
        return DEFAULT_DOCK_SIZE;
      }
      return v;
    },
  } as any;

  /**
   * Sets the dock top size. Can be specified in absolute or percentage values.
   * Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "100%".
   */
  dockTopSize = input<ArithmeticExpression>(DEFAULT_DOCK_SIZE, { ...this._dockTopSizeOptions });

  protected _dockRightSizeOptions = {
    transform: (v: number) => {
      const valid = validateFloat(v, true) || isPercentageValue(v);
      if (!valid) {
        console.error('The "dockRight" parameter must be one of type `number` or `string`.');
        return DEFAULT_DOCK_SIZE;
      }
      return v;
    },
  } as any;

  /**
   * Sets the dock right size. Can be specified in absolute or percentage values.
   * Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "100%".
   */
  dockRightSize = input<ArithmeticExpression>(DEFAULT_DOCK_SIZE, { ...this._dockRightSizeOptions });

  protected _dockBottomSizeOptions = {
    transform: (v: number) => {
      const valid = validateFloat(v, true) || isPercentageValue(v);
      if (!valid) {
        console.error('The "dockBottom" parameter must be one of type `number` or `string`.');
        return DEFAULT_DOCK_SIZE;
      }
      return v;
    },
  } as any;

  /**
   * Sets the dock bottom size. Can be specified in absolute or percentage values.
   * Supports arithmetic expressions of addition `50% + 25` or subtraction `50% - 25`. Default value is "100%".
   */
  dockBottomSize = input<ArithmeticExpression>(DEFAULT_DOCK_SIZE, { ...this._dockBottomSizeOptions });

  protected override _animationParamsOptions = {
    transform: (v: INtDrawerAnimationParams) => {
      const valid = validateObject(v, true, true);

      if (!validateFloat(v.scrollToItem)) {
        console.error('The "scrollToItem" parameter must be of type `number`.');
        return DEFAULT_ANIMATION_PARAMS;
      }
      if (!validateFloat(v.snapToItem)) {
        console.error('The "snapToItem" parameter must be of type `number`.');
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
   * Animation parameters. The default value is "{ scrollToItem: 500, snapToItem: 500 }".
   */
  override animationParams = input<INtDrawerAnimationParams>(DEFAULT_ANIMATION_PARAMS, { ...this._animationParamsOptions });

  protected override _snappingDistanceOptions = {
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
   * The default value is `5%`.
   */
  override snappingDistance = input<SnappingDistance>(DEFAULT_SNAPPING_DISTANCE, { ...this._snappingDistanceOptions });

  /**
   * Left dock.
   * Example: `<nt-drawer [leftDock]="leftDockTemplate">
   *  <ng-template #leftDockTemplate>
   *    Left content
   * </ng-template>
   * `
   */
  dockLeft = input<TemplateRef<any> | null>(null);

  /**
   * Top dock.
   * Example: `<nt-drawer [topDock]="topDockTemplate">
   *  <ng-template #topDockTemplate>
   *    Top content
   * </ng-template>
   * `
   */
  dockTop = input<TemplateRef<any> | null>(null);

  /**
   * Right dock.
   * Example: `<nt-drawer [rightDock]="rightDockTemplate">
   *  <ng-template #rightDockTemplate>
   *    Right content
   * </ng-template>
   * `
   */
  dockRight = input<TemplateRef<any> | null>(null);

  /**
   * Bottom dock.
   * Example: `<nt-drawer [bottomDock]="bottomDockTemplate">
   *  <ng-template #bottomDockTemplate>
   *    Bottom content
   * </ng-template>
   * `
   */
  dockBottom = input<TemplateRef<any> | null>(null);

  private _$visible = new BehaviorSubject<boolean>(false);
  protected $visible = this._$visible.asObservable();

  private _$opened = new BehaviorSubject<boolean>(false);
  $opened = this._$opened.asObservable();

  private _$open = new Subject<DrawerDockPosition | null>();
  protected $open = this._$open.asObservable();

  private _$position = new BehaviorSubject<DrawerDockPosition | null>(null);
  $position = this._$position.asObservable();
  get position() { return this._$position.getValue(); }

  private _$scrollRatio = new BehaviorSubject<number>(0);
  protected $scrollRatio = this._$scrollRatio.asObservable();

  protected _precalculatedDockLeftSize = signal<number>(0);

  protected _precalculatedDockTopSize = signal<number>(0);

  protected _precalculatedDockRightSize = signal<number>(0);

  protected _precalculatedDockBottomSize = signal<number>(0);

  protected _breakpoints: Signal<IDrawerBreakpoints | null>;

  constructor() {
    super();

    this._service.initialize(this._id, this._scrollerComponent()!, this._parentService);

    this._breakpoints = computed(() => {
      const bounds = this._bounds() ?? { width: 0, height: 0 },
        leftSize = this._precalculatedDockLeftSize(),
        topSize = this._precalculatedDockTopSize(),
        rightSize = this._precalculatedDockRightSize(),
        bottomSize = this._precalculatedDockBottomSize(),
        maxScrollSize = leftSize + rightSize,
        inverted = false,
        result: IDrawerBreakpoints = [];
      const rows = 3, columns = 3;
      let id = 0, x = 0, y = 0, width = 0, height = 0, replacementX = 0, replacementY = 0, replacementWidth = 0, replacementHeight = 0;
      for (let i = 0; i < rows; i++) {
        switch (i) {
          case 0: {
            height = replacementHeight = topSize;
            break;
          }
          case 1: {
            height = bounds.height;
            replacementHeight = bottomSize;
            break;
          }
          case 2: {
            height = replacementHeight = bottomSize;
            break;
          }
        }

        for (let j = 0; j < columns; j++) {
          switch (j) {
            case 0: {
              width = replacementWidth = leftSize;
              break;
            }
            case 1: {
              width = bounds.width;
              replacementWidth = rightSize;
              break;
            }
            case 2: {
              width = replacementWidth = rightSize;
              break;
            }
          }
          const breakpoint: IDrawerBreakpoint = {
            id,
            config: {
              available: id !== 0 && id !== 2 && id !== 6 && id !== 8,
              isFirst: id === 0,
              isLast: id === 8,
              inverted,
            },
            measures: {
              x,
              y,
              maxScrollSize,
            },
            bounds: {
              width,
              height,
            },
            replacementMeasurements: {
              x: replacementX,
              y: replacementY,
              width: replacementWidth,
              height: replacementHeight,
            },
          };
          id++;
          result.push(breakpoint);
          if (id % columns === 0) {
            y += height;
            replacementY += replacementHeight;
          } else {
            x += width;
            replacementX += replacementWidth;
          }
          if ((j + 1) % columns === 0) {
            x = replacementX = 0;
          }
        }
      }
      return result;
    });

    const $bounds = toObservable(this._bounds).pipe(
      takeUntilDestroyed(),
      filter(b => !!b),
    ),
      $breakpoints = toObservable(this._breakpoints),
      $rawDockLeftSize = toObservable(this.dockLeftSize),
      $rawDockTopSize = toObservable(this.dockTopSize),
      $rawDockRightSize = toObservable(this.dockRightSize),
      $rawDockBottomSize = toObservable(this.dockBottomSize);

    combineLatest([$bounds, $rawDockLeftSize]).pipe(
      takeUntilDestroyed(),
      tap(([bounds, value]) => {
        const val = parseArithmeticExpression(value, bounds.width);
        this._precalculatedDockLeftSize.set(val);
      }),
    ).subscribe();

    combineLatest([$bounds, $rawDockTopSize]).pipe(
      takeUntilDestroyed(),
      tap(([bounds, value]) => {
        const val = parseArithmeticExpression(value, bounds.height);
        this._precalculatedDockTopSize.set(val);
      }),
    ).subscribe();

    combineLatest([$bounds, $rawDockRightSize]).pipe(
      takeUntilDestroyed(),
      tap(([bounds, value]) => {
        const val = parseArithmeticExpression(value, bounds.width);
        this._precalculatedDockRightSize.set(val);
      }),
    ).subscribe();

    combineLatest([$bounds, $rawDockBottomSize]).pipe(
      takeUntilDestroyed(),
      tap(([bounds, value]) => {
        const val = parseArithmeticExpression(value, bounds.height);
        this._precalculatedDockBottomSize.set(val);
      }),
    ).subscribe();

    const $precalculatedDockLeftSize = toObservable(this._precalculatedDockLeftSize),
      $precalculatedDockTopSize = toObservable(this._precalculatedDockTopSize),
      $precalculatedDockRightSize = toObservable(this._precalculatedDockRightSize),
      $precalculatedDockBottomSize = toObservable(this._precalculatedDockBottomSize),
      $open = this.$open;

    $open.pipe(
      takeUntilDestroyed(),
      tap(v => {
        this._$position.next(v);
        const { x, y } = this.getPosition(v);
        if (v !== null) {
          const params: IScrollOptions = { x, y, blending: false, behavior: this.scrollBehavior(), duration: this.animationParams().scrollToItem };
          this.scrollTo(params);
          this.onOpen.emit(v);
        } else {
          this.scrollTo({ x, y, blending: false, behavior: this.scrollBehavior(), duration: this.animationParams().scrollToItem });
          this.onClose.emit();
        }
      }),
    ).subscribe();

    const $scroller = toObservable(this._scrollerComponent).pipe(
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

    let userAction = false;
    this.$scroll.pipe(
      takeUntilDestroyed(),
      tap(e => {
        userAction = e.userAction;
      }),
    ).subscribe();

    const $scroll = this.$scroll.pipe(
      takeUntilDestroyed(),
      startWith({ userAction: false }),
      switchMap(e => $viewportResize.pipe(
        takeUntilDestroyed(this._destroyRef),
        startWith(null),
        map(v => !v ? e : { ...e, userAction: false }),
      )),
    );

    const $init = this.$initialized;
    $init.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      debounceTime(100),
      tap(() => {
        this._$visible.next(true);
      }),
    ).subscribe();

    combineLatest([
      $init,
      $contentResize.pipe(
        takeUntilDestroyed(),
        startWith(null),
      ),
      $viewportResize.pipe(
        takeUntilDestroyed(),
        startWith(null),
      ),
    ]).pipe(
      takeUntilDestroyed(),
      debounceTime(0),
      filter(([v]) => !!v && !userAction),
      tap(() => {
        this._scrollerComponent()?.stopScrolling?.();
        const position = this.position;
        const { x, y } = this.getPosition(position);
        this.scrollTo({
          x, y, behavior: BEHAVIOR_INSTANT, duration: 0, blending: false, snap: false,
        });
      }),
    ).subscribe();

    combineLatest([$precalculatedDockLeftSize, $precalculatedDockTopSize, $precalculatedDockRightSize, $precalculatedDockBottomSize, $scroll, $bounds]).pipe(
      takeUntilDestroyed(),
      map(([dockLeftSize, dockTopSize, dockRightSize, dockBottomSize, e]) => {
        const { x, y } = this.getPositionRatio();

        this._$opened.next(x !== 1 || y !== 1);

        this._$scrollRatio.next(x !== 1 ? x : y);

        return { x, y, dockLeftSize, dockTopSize, dockRightSize, dockBottomSize };
      }),
      debounceTime(100),
      tap(({ x, y, dockLeftSize, dockTopSize, dockRightSize, dockBottomSize }) => {
        const scrollLeft = this.scrollLeft, scrollTop = this.scrollTop;
        if (x === 0 && dockLeftSize > 0 && scrollLeft === 0) {
          this._$open.next(DrawerDockPositions.LEFT);
        } else if (x === 0 && dockRightSize > 0 && scrollLeft === this.scrollWidth) {
          this._$open.next(DrawerDockPositions.RIGHT);
        } else if (y === 0 && dockTopSize > 0 && scrollTop === 0) {
          this._$open.next(DrawerDockPositions.TOP);
        } else if (y === 0 && dockBottomSize > 0 && scrollTop === this.scrollHeight) {
          this._$open.next(DrawerDockPositions.BOTTOM);
        } else if (x === 1 && x === 1) {
          this._$open.next(null);
        }
      }),
    ).subscribe();

    $breakpoints.pipe(
      takeUntilDestroyed(),
      tap(v => {
        this._service.breakpoints = v;
      }),
    ).subscribe();

    $bounds.pipe(
      takeUntilDestroyed(),
      tap(v => {
        this._service.bounds = v;
      }),
    ).subscribe();
  }

  private getPosition(position: DrawerDockPosition | null) {
    if (position !== null) {
      const result: IPoint = { x: 0, y: 0 };
      switch (position) {
        case DrawerDockPositions.LEFT: {
          result.x = 0;
          result.y = this._precalculatedDockTopSize();
          break;
        }
        case DrawerDockPositions.TOP: {
          result.x = this._precalculatedDockLeftSize();
          result.y = 0;
          break;
        }
        case DrawerDockPositions.RIGHT: {
          result.x = this._precalculatedDockLeftSize() + this._precalculatedDockRightSize() + (this._bounds()?.width ?? 0);
          result.y = this._precalculatedDockTopSize();
          break;
        }
        case DrawerDockPositions.BOTTOM: {
          result.x = this._precalculatedDockLeftSize();
          result.y = this._precalculatedDockTopSize() + this._precalculatedDockBottomSize() + (this._bounds()?.height ?? 0);
          break;
        }
      }
      return result;
    } else {
      return {
        x: this._precalculatedDockLeftSize(), y: this._precalculatedDockTopSize(),
      } as IPoint;
    }
  }

  private getPositionRatio(): IPoint {
    const scrollLeft = this.scrollLeft, scrollTop = this.scrollTop, dockLeftSize = this._precalculatedDockLeftSize(), dockTopSize = this._precalculatedDockTopSize(),
      dockRightSize = this._precalculatedDockRightSize(), dockBottomSize = this._precalculatedDockBottomSize();
    let sx: number, sy: number;
    if (scrollLeft < dockLeftSize) {
      sx = dockLeftSize !== 0 ? (scrollLeft / dockLeftSize) : 0;
    } else if (scrollLeft > dockLeftSize) {
      sx = 1 - (dockRightSize !== 0 ? ((scrollLeft - dockLeftSize) / dockRightSize) : 0);
    } else {
      sx = 1;
    }
    if (scrollTop < dockTopSize) {
      sy = dockTopSize !== 0 ? (scrollTop / dockTopSize) : 0;
    } else if (scrollTop > dockTopSize) {
      sy = 1 - (dockBottomSize !== 0 ? ((scrollTop - dockTopSize) / dockBottomSize) : 0);
    } else {
      sy = 1;
    }
    return { x: sx, y: sy };
  }

  /**
   * Opens the dock at the specified position.
   */
  open(position: DrawerDockPosition) {
    switch (position) {
      case DrawerDockPositions.LEFT: {
        this._$open.next(DrawerDockPositions.LEFT);
        break;
      }
      case DrawerDockPositions.TOP: {
        this._$open.next(DrawerDockPositions.TOP);
        break;
      }
      case DrawerDockPositions.RIGHT: {
        this._$open.next(DrawerDockPositions.RIGHT);
        break;
      }
      case DrawerDockPositions.BOTTOM: {
        this._$open.next(DrawerDockPositions.BOTTOM);
        break;
      }
    }
  }

  /**
   * Closes the dock
   */
  close() {
    this._$open.next(null);
  }
}
