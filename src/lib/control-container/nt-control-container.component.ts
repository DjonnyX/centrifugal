import { Component, ElementRef, input, signal, viewChild, ViewEncapsulation } from "@angular/core";
import { INtScrollViewService, NtScrollViewService } from "../scroll-view";
import { CONTROL_CONTAINER_SERVICE, SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE, SCROLL_VIEW_USER_INTERACTION_ENABLED } from "../common";
import { MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, TOUCH_END, TOUCH_MOVE, TOUCH_START, WHEEL } from "../common/const/event-names";
import { NtControlContainerService } from "./nt-control-container.service";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { combineLatest, debounceTime, filter, fromEvent, map, switchMap, tap } from "rxjs";
import { INtControlContainerService } from "./interfaces";
import { NtDrawerContainerComponent } from "../drawer-container";
import { DEFAULT_INPUT_ELEMETNS } from "../common/directives/nt-virtual-click/const";
import { IBaseScrollViewService } from "../common/interfaces/base-scroll-view-service";

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
    { provide: SCROLL_VIEW_SERVICE, useClass: NtScrollViewService },
    { provide: CONTROL_CONTAINER_SERVICE, useClass: NtControlContainerService },
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

  protected _keyboardShown = signal<boolean>(false);

  protected _contentOffset = signal<number>(0);

  constructor() {
    super();
    this._controlService.initialize(this._id, this._parentService.id, this.host);

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
      tap(e => {
        if (!!e && !!e.element) {
          const target = e.element, targetTagName = target.tagName?.toLocaleLowerCase();
          if (!!targetTagName && DEFAULT_INPUT_ELEMETNS.indexOf(targetTagName) > -1) {
            if (target.blur instanceof Function) {
              target.blur();
            }
            this._keyboardShown.set(true);
            this.scrollTo({ top: 200 /* keyboard height */, behavior: 'auto', duration: 250 });
            const scroller = e.scroller;
              console.log('scroller', scroller?.service.id, scroller?.type)
            if (!!scroller) {
              const { height: targetHeight } = target.getBoundingClientRect(),
                { height: scrollerViewportHeight } = scroller.viewportBounds(),
                y = (target.offsetTop + targetHeight) - (scrollerViewportHeight - 200) /* keyboard height */ - 20 /* gap */;
              let s = scroller.service, hostService: IBaseScrollViewService | null = null;
              while (true) {
                // if (s === this._service) {
                //   break;
                // }
                console.log('s', s.id)
                hostService = s ?? null;
                s = s.parent;
                if (!s.scrollView) {
                  break;
                }
              }
              console.log('host', hostService?.id, hostService?.scrollView?.type)
              hostService?.scrollView?.scroll({ x: scroller.scrollLeft, y, behavior: 'auto', duration: 250, userAction: true });
            }
          } else {
            this._keyboardShown.set(false);
            this.scrollTo({ top: 0, behavior: 'auto', duration: 250 });
          }
        }
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
}