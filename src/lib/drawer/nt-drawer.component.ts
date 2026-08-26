import { ChangeDetectionStrategy, Component, computed, input, OnDestroy, Signal, signal, TemplateRef, ViewEncapsulation } from "@angular/core";
import { INtScrollViewService, NtScrollViewComponent, NtScrollViewService } from "../scroll-view";
import {
  ArithmeticExpression, SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE, SCROLL_VIEW_USER_INTERACTION_ENABLED,
  TextDirections,
} from "../common";
import { isPercentageValue, parseArithmeticExpression, validateFloat } from "../common/utils";
import { DEFAULT_DOCK_SIZE } from "./const";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { combineLatest, filter, tap } from "rxjs";
import { IDrawerBreakpoint, IDrawerBreakpoints, INtDrawerService } from "./interfaces";
import { NtDrawerService } from './nt-drawer.service';

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

    this._breakpoints = computed(() => {
      const langTextDir = this.langTextDir(),
        bounds = this._bounds() ?? { width: 0, height: 0 },
        leftSize = this._precalculatedDockLeftSize(),
        topSize = this._precalculatedDockTopSize(),
        rightSize = this._precalculatedDockRightSize(),
        bottomSize = this._precalculatedDockBottomSize(),
        maxScrollSize = leftSize + rightSize,
        inverted = langTextDir === TextDirections.RTL,
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
  }
}
