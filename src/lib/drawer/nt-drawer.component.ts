import { ChangeDetectionStrategy, Component, computed, input, Signal, signal, TemplateRef, ViewEncapsulation } from "@angular/core";
import { INtScrollViewService, NtScrollViewComponent } from "../scroll-view";
import {
  ArithmeticExpression, IScrollOptions, SCROLL_VIEW_AXLE_LOCK, SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE, SCROLL_VIEW_USER_INTERACTION_ENABLED,
  TextDirection, TextDirections,
} from "../common";
import { isPercentageValue, parseArithmeticExpression, validateBoolean, validateFloat } from "../common/utils";
import { DEFAULT_BACKDROP, DEFAULT_DOCK_SIZE } from "./const";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { BehaviorSubject, combineLatest, debounceTime, filter, tap } from "rxjs";
import { IDrawerBreakpoint, IDrawerBreakpoints, INtDrawerService } from "./interfaces";
import { NtDrawerService } from './nt-drawer.service';
import { DrawerDockPositions } from './enums';
import { DrawerDockPosition } from './types';

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
    { provide: SCROLL_VIEW_USER_INTERACTION_ENABLED, useValue: true },
    { provide: SCROLL_VIEW_OVERSCROLL_ENABLED, useValue: true },
    { provide: SCROLL_VIEW_AXLE_LOCK, useValue: true },
    { provide: SCROLL_VIEW_SERVICE, useClass: NtDrawerService },
  ],
})
export class NtDrawerComponent extends NtScrollViewComponent<INtDrawerService, INtScrollViewService> {
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

  private _$opened = new BehaviorSubject<boolean>(false);
  protected $opened = this._$opened.asObservable();

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

    const $bounds = toObservable(this._bounds).pipe(
      takeUntilDestroyed(),
      filter(b => !!b),
    ),
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
      $precalculatedDockBottomSize = toObservable(this._precalculatedDockBottomSize);

    const $init = this.$initialized;
    combineLatest([$precalculatedDockLeftSize, $precalculatedDockTopSize, $init]).pipe(
      takeUntilDestroyed(),
      filter(([, , v]) => !!v),
      debounceTime(50),
      tap(([left, top]) => {
        this.scrollLeft = left;
        this.scrollTop = top;
      }),
    ).subscribe();

    combineLatest([$precalculatedDockLeftSize, $precalculatedDockTopSize, this.$scroll, $bounds]).pipe(
      takeUntilDestroyed(),
      tap(([dockLeftSize, dockTopSize]) => {
        this._$opened.next(!(this.scrollLeft === dockLeftSize && this.scrollTop === dockTopSize));
      }),
    ).subscribe();

    combineLatest([$precalculatedDockLeftSize, $precalculatedDockTopSize, $precalculatedDockRightSize, $precalculatedDockBottomSize, this.$scroll, $bounds]).pipe(
      takeUntilDestroyed(),
      tap(([dockLeftSize, dockTopSize, dockRightSize, dockBottomSize]) => {
        const scrollLeft = this.scrollLeft, scrollTop = this.scrollTop;
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
        this._$scrollRatio.next(sx !== 1 ? sx : sy);
      }),
    ).subscribe();

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
      let id = 0, x = 0, y = 0, width = 0, height = 0;
      for (let i = 0; i < rows; i++) {
        switch (i) {
          case 0: {
            height = topSize;
            break;
          }
          case 1: {
            height = bounds.height;
            break;
          }
          case 2: {
            height = bottomSize;
            break;
          }
        }

        for (let j = 0; j < columns; j++) {
          switch (j) {
            case 0: {
              width = leftSize;
              break;
            }
            case 1: {
              width = bounds.width;
              break;
            }
            case 2: {
              width = rightSize;
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
          };
          id++;
          result.push(breakpoint);
          if (id % columns === 0) {
            y += height;
          } else {
            x += width;
          }
          if ((j + 1) % columns === 0) {
            x = 0;
          }
        }
      }
      return result;
    });

    const $breakpoints = toObservable(this._breakpoints);

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

  /**
   * Opens the dock at the specified position.
   */
  open(position: DrawerDockPosition) {
    const params: IScrollOptions = { blending: false, behavior: this.scrollBehavior(), duration: this.animationParams().scrollToItem };
    switch (position) {
      case DrawerDockPositions.LEFT: {
        params.x = 0;
        params.y = this._precalculatedDockTopSize();
        break;
      }
      case DrawerDockPositions.TOP: {
        params.x = this._precalculatedDockLeftSize();
        params.y = 0;
        break;
      }
      case DrawerDockPositions.RIGHT: {
        params.x = this._precalculatedDockLeftSize() + this._precalculatedDockRightSize() + (this._bounds()?.width ?? 0);
        params.y = this._precalculatedDockTopSize();
        break;
      }
      case DrawerDockPositions.BOTTOM: {
        params.x = this._precalculatedDockLeftSize();
        params.y = this._precalculatedDockTopSize() + this._precalculatedDockBottomSize() + (this._bounds()?.height ?? 0);
        break;
      }
    }
    this.scrollTo(params);
  }

  /**
   * Closes the dock
   */
  close() {
    this.scrollTo({ x: this._precalculatedDockLeftSize(), y: this._precalculatedDockTopSize(), blending: false, behavior: this.scrollBehavior(), duration: this.animationParams().scrollToItem });
  }
}
