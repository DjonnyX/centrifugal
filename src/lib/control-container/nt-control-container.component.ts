import { Component, ElementRef, input, signal, viewChild, ViewEncapsulation } from "@angular/core";
import { INtScrollViewService, NtScrollViewService } from "../scroll-view";
import {
  CONTROL_CONTAINER_SERVICE, SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE,
  SCROLL_VIEW_USER_INTERACTION_ENABLED,
} from "../common";
import { MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, TOUCH_END, TOUCH_MOVE, TOUCH_START, WHEEL } from "../common/const/event-names";
import { NtControlContainerService } from "./nt-control-container.service";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { combineLatest, debounceTime, filter, fromEvent, map, of, skipUntil, Subject, switchMap, tap, timer } from "rxjs";
import { INtControlContainerService } from "./interfaces";
import { NtDrawerContainerComponent } from "../drawer-container";
import { IBaseScrollViewService } from "../common/interfaces/base-scroll-view-service";
import { isInteractive } from "../common/utils/is-interactive";
import { ScrollerTypes } from "../common/enums/scroller-types";
import { IFocusedObject } from "../common/interfaces/focused-object";

/**
 * NtScrollViewComponent
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
    { provide: CONTROL_CONTAINER_SERVICE, useClass: NtControlContainerService },
    { provide: SCROLL_VIEW_SERVICE, useClass: NtScrollViewService },
  ],
})
export class NtControlContainerComponent extends NtDrawerContainerComponent<INtScrollViewService, INtScrollViewService, INtControlContainerService> {
  protected _containerComponent = viewChild<ElementRef<HTMLDivElement>>('container');

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

  protected _contentOffset = signal<number>(0);

  private _$hostScroll = new Subject<IFocusedObject | null>();
  protected $hostScroll = this._$hostScroll.asObservable();

  constructor() {
    super();
    this._controlService.initialize(this._id, this._parentService?.id ?? -1, this.host);

    const $scroller = toObservable(this._scrollerComponent).pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
    ),
      $content = $scroller.pipe(
        takeUntilDestroyed(this._destroyRef),
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

    this._controlService.$focusedElement.pipe(
      takeUntilDestroyed(),
      switchMap(e => {
        if (!!e && !!e.element) {
          const target = e.element, targetTagName = target.tagName?.toLocaleLowerCase();
          if (!!targetTagName && isInteractive(targetTagName)) {
            if (target.blur instanceof Function) {
              target.blur();
            }
            const scroller = e.scroller;
            if (!!scroller) {
              this.scrollTo({
                top: 200 /* keyboard height */, behavior: 'auto', duration: 250, onUpdate: () => {
                  this.hostScrollTo(e, true);
                }, onComplete: () => {
                  this.hostScrollTo(e, true);
                }
              });
              this._$hostScroll.next(e);
            }
            return of({ visible: true, target });
          }
        }
        this._scrollerComponent()?.scrollTo({ top: 0, behavior: 'auto', duration: 250 }) ?? null;
        return of({ visible: false, target: null });
      }),
      filter(e => e.visible),
      switchMap(e => {
        return this._controlService.$overscrollCanceled.pipe(
          takeUntilDestroyed(this._destroyRef),
          skipUntil(timer(100).pipe(switchMap(() => of(true)))),
          tap(event => {
            const scroller = this._scrollerComponent()!;
            this._controlService.focus({ id: -1, element: this._elementRef.nativeElement, type: scroller.type ?? ScrollerTypes.SCROLL_VIEW_SCROLLER, scroller });
          }),
        );
      }),
    ).subscribe();

    this.$hostScroll.pipe(
      takeUntilDestroyed(this._destroyRef),
      tap(e => {
        this.hostScrollTo(e);
      }),
      debounceTime(250),
      tap(e => {
        this.hostScrollTo(e);
      }),
    ).subscribe();

    $scroller.pipe(
      takeUntilDestroyed(),
      switchMap(scroller => {
        return combineLatest([scroller.$scroll, scroller.$resizeContent, scroller.$resizeViewport]).pipe(
          tap(() => {
            this._contentOffset.set(scroller.verticalScrollRatio * 200 /* keyboard height */ * .9 /* offset ratio */);
          }),
        );
      }),
    ).subscribe();
  }

  private hostScrollTo(e: IFocusedObject | null, blending: boolean = false) {
    if (!!e && !!e.element) {
      const target = e.element
      const { height: targetHeight } = target.getBoundingClientRect();
      let offsetTop = target.offsetTop;
      const scroller = e.scroller;
      if (!!scroller) {
        let s = scroller.service, hostService: IBaseScrollViewService | null = null;
        while (true) {
          if (!!s?.scrollView?.parent?.host) {
            offsetTop += s.scrollView.parent.host.getBoundingClientRect().top;
          }
          if (s === this._service) {
            break;
          }
          hostService = s ?? null;
          s = s.parent;
          if (!s?.scrollView) {
            break;
          }
        }
        const { height: scrollerViewportHeight } = this._scrollerComponent()?.viewportBounds() ?? { height: 0 },
          x = scroller.scrollLeft,
          y = (offsetTop + targetHeight + 20 /* gap */) - (scrollerViewportHeight - 200) /* keyboard height */;

        hostService?.scrollView?.stopScrolling(true);
        hostService?.scrollView?.scroll({ x: x, y: y, behavior: 'auto', blending, duration: 250, userAction: true });
      }
    }
  }
}