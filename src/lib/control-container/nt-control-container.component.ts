import { Component, input, ViewEncapsulation } from "@angular/core";
import { INtScrollViewService, NtVirtualScrollViewService } from "../scroll-view";
import { CONTROL_CONTAINER_SERVICE, SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE, SCROLL_VIEW_USER_INTERACTION_ENABLED } from "../common";
import { MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, TOUCH_END, TOUCH_MOVE, TOUCH_START, WHEEL } from "../common/const/event-names";
import { NtControlContainerService } from "./nt-control-container.service";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { filter, fromEvent, map, switchMap, tap } from "rxjs";
import { INtControlContainerService } from "./interfaces";
import { NtDrawerContainerComponent } from "../drawer-container";

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
export class NtControlContainerComponent extends NtDrawerContainerComponent<INtScrollViewService, INtControlContainerService> {
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