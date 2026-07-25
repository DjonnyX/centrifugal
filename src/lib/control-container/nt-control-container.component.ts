import { Component, inject, input, TemplateRef, ViewEncapsulation } from "@angular/core";
import { IScrollViewService, NtVirtualScrollViewComponent, NtVirtualScrollViewService } from "../scroll-view";
import { CONTROL_CONTAINER_SERVICE, SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE, SCROLL_VIEW_USER_INTERACTION_ENABLED } from "../common";
import { MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, TOUCH_END, TOUCH_MOVE, TOUCH_START, WHEEL } from "../common/const/event-names";
import { NtControlContainerService } from "./nt-control-container.service";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { filter, fromEvent, map, switchMap, tap } from "rxjs";
import { IControlContainerService } from "./interfaces";

/**
 * NtVirtualScrollViewComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-control-container.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
  selector: 'nt-control-container',
  templateUrl: './nt-control-container.component.html',
  styleUrl: './nt-control-container.component.scss',
  host: {
    'style': 'position: relative;'
  },
  standalone: false,
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [
    { provide: SCROLL_VIEW_USER_INTERACTION_ENABLED, useValue: false },
    { provide: SCROLL_VIEW_OVERSCROLL_ENABLED, useValue: false },
    { provide: SCROLL_VIEW_SERVICE, useClass: NtVirtualScrollViewService },
    { provide: CONTROL_CONTAINER_SERVICE, useClass: NtControlContainerService },
  ],
})
export class NtControlContainerComponent extends NtVirtualScrollViewComponent<IScrollViewService> {
  protected _controlService = inject<IControlContainerService>(CONTROL_CONTAINER_SERVICE);

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

  protected override _clickDistance = {
    transform: (v: number) => {
      console.error('The "clickDistance" property is not available.');
      return 0;
    },
  } as any;

  /**
   * @deprecated
   * The `clickDistance` property is not available for the control container.
   */
  override clickDistance = input<number>(0, { ...this._clickDistance });

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

  protected override _overscrollEnabledOptions = {
    transform: (v: boolean) => {
      console.error('The "overscrollEnabled" property is not available.');
      return false;
    },
  } as any;

  /**
   * @deprecated
   * The `overscrollEnabled` property is not available for the control container.
   */
  override overscrollEnabled = input<boolean>(false, { ...this._overscrollEnabledOptions });

  constructor() {
    super();

    this._controlService.initialize(this._id, this.host);

    const $content = toObservable(this._scrollerComponent).pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      map(v => v.host),
    ), $wheelEmitter = $content;

    $wheelEmitter.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      switchMap(content => {
        return fromEvent<WheelEvent>(content, WHEEL, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (e.cancelable) {
              e.preventDefault();
            }
          }),
        );
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      switchMap(content => {
        return fromEvent<MouseEvent>(content, MOUSE_DOWN, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (e.cancelable) {
              e.preventDefault();
            }
          }),
        );
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      switchMap(content => {
        return fromEvent<MouseEvent>(content, MOUSE_MOVE, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (e.cancelable) {
              e.preventDefault();
            }
          }),
        );
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      switchMap(content => {
        return fromEvent<MouseEvent>(content, MOUSE_UP, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (e.cancelable) {
              e.preventDefault();
            }
          }),
        );
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      switchMap(content => {
        return fromEvent<TouchEvent>(content, TOUCH_START, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (e.cancelable) {
              e.preventDefault();
            }
          }),
        );
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      switchMap(content => {
        return fromEvent<TouchEvent>(content, TOUCH_MOVE, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (e.cancelable) {
              e.preventDefault();
            }
          }),
        );
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      switchMap(content => {
        return fromEvent<TouchEvent>(content, TOUCH_END, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (e.cancelable) {
              e.preventDefault();
            }
          }),
        );
      }),
    ).subscribe();
  }
}