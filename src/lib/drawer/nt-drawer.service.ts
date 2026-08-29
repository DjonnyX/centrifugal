import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { INtDrawerService } from './interfaces/nt-drawer-service';
import { DEFAULT_ANIMATION_PARAMS } from '../scroll-view/const';
import { INtScrollViewAnimationParams } from '../scroll-view';
import { NtBaseScrollViewService } from '../common/services/nt-base-scroll-view.service';
import { INtBaseScrollViewService } from '../common/interfaces/nt-base-scroll-view-service';
import { Direction, Directions, Id, IRect, IScrollOptions, ISize } from '../common';
import { INtScroller } from '../common/interfaces/nt-scroller';
import { IDrawerBreakpoints } from './interfaces/drawer-breakpoints';
import { MAX_TRACE_VALUE, MIN_TRACE_VALUE } from './const';

/**
 * NtDrawerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/drawer/nt-drawer.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtDrawerService extends NtBaseScrollViewService implements INtBaseScrollViewService, INtDrawerService {
  scrollLeftOffset: number = 0;

  scrollRightOffset: number = 0;

  scrollTopOffset: number = 0;

  scrollBottomOffset: number = 0;

  isInfinity: boolean = false;

  isVertical: boolean = true;

  snapScrollToLeft: boolean = false;

  snapScrollToRight: boolean = false;

  snapScrollToTop: boolean = false;

  snapScrollToBottom: boolean = false;

  animationParams: INtScrollViewAnimationParams = DEFAULT_ANIMATION_PARAMS;

  direction: Direction = Directions.BOTH;

  bounds: ISize | null = null;

  private _$scrollBarSize = new BehaviorSubject<number>(0);
  readonly $scrollBarSize = this._$scrollBarSize.asObservable();
  get scrollBarSize() { return this._$scrollBarSize.getValue(); }

  set scrollBarSize(v: number) {
    if (this.scrollBarSize === v) {
      return;
    }

    this._$scrollBarSize.next(v);
  }

  private _$focusedElement = new BehaviorSubject<HTMLElement | null>(null);
  readonly $focusedElement = this._$focusedElement.asObservable();
  set focusedElement(v: HTMLElement | null) {
    if (this._$focusedElement.getValue() !== v) {
      this._$focusedElement.next(v);
    }
  }
  get focusedElement() {
    return this._$focusedElement.getValue();
  }

  private _emitter: HTMLElement = window as unknown as HTMLElement;
  get emitter() {
    return this._emitter;
  };

  breakpoints: IDrawerBreakpoints | null = null;

  constructor() {
    super();
  }

  initialize(id: number, scrollView: INtScroller<INtBaseScrollViewService>, parentService: INtBaseScrollViewService | null) {
    this._id = id;
    this._scrollView = scrollView;
    if (!!parentService) {
      this._parent = parentService;
      this._parentId = parentService.id;
    }
  }

  override getComponentBoundsByIntersectionPosition(positionX: number, positionY: number, maxPositionX: number | null = null, maxPositionY: number | null = null):
    (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; available?: boolean; }) | null {
    const breakpointItems = this.breakpoints;
    let first: (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; available: boolean }) | null = null,
      last: (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; available: boolean }) | null = null;
    if (!!breakpointItems) {
      for (let i = 0, l = breakpointItems.length; i < l; i++) {
        const breakpoint = breakpointItems[i],
          id = breakpoint.id ?? null,
          inverted = breakpoint.config.inverted ?? false,
          maxScrollSize = breakpoint.measures.maxScrollSize ?? 0,
          { width, height } = breakpoint.bounds,
          x = breakpoint.measures.x ?? 0,
          xx = inverted ? (maxScrollSize - x) - width : x,
          y = breakpoint.measures?.y ?? 0,
          isFirst = breakpoint.config.isFirst ?? false,
          isLast = breakpoint.config.isLast ?? false,
          available = breakpoint.config.available ?? null,
          posX = positionX,
          posY = positionY;
        if ((posY >= y && posY < y + height) && (posX >= xx && posX < xx + width)) {
          return { id, x: xx, y, width, height, isFirst, isLast, available };
        }
        if (isFirst) {
          first = { id, x: xx, y, width, height, isFirst, isLast, available };
        } else if (isLast) {
          last = { id, x: xx, y, width, height, isFirst, isLast, available };
        }
      }
    }
    if (positionX < 0 && positionY < 0) {
      return first;
    }
    if ((maxPositionX !== null && positionX > maxPositionX) && (maxPositionY !== null && positionY > maxPositionY)) {
      return last;
    }
    return null;
  }

  override setIntersectionElementBySnapToItemAlign(id: Id | null) {
    if (this._$intersectionElementBySnapToItemAlign.getValue() !== id) {
      this._$intersectionElementBySnapToItemAlign.next(id);
    }
  }

  // 4 edges trace
  getBreakpointsByIntersectionPosition(positionX: number, positionY: number, maxPositionX: number | null = null, maxPositionY: number | null = null):
    (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; available?: boolean; }) | null {
    const breakpointItems = this.breakpoints;
    let first: (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; available: boolean }) | null = null,
      last: (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; available: boolean }) | null = null;
    if (!!breakpointItems) {
      for (let i = 0, l = breakpointItems.length; i < l; i++) {
        const breakpoint = breakpointItems[i],
          id = breakpoint.id ?? null,
          inverted = breakpoint.config.inverted ?? false,
          maxScrollSize = breakpoint.measures.maxScrollSize ?? 0,
          { width, height } = breakpoint.bounds,
          x = breakpoint.measures.x ?? 0,
          xx = inverted ? (maxScrollSize - x) - width : x,
          y = breakpoint.measures?.y ?? 0,
          isFirst = breakpoint.config.isFirst ?? false,
          isLast = breakpoint.config.isLast ?? false,
          available = breakpoint.config.available ?? null,
          posX = positionX,
          posY = positionY;
        if (width === 0 || height === 0) {
          continue;
        }
        if ((posY >= y && posY < y + height) && (posX >= xx && posX < xx + width)) {
          return { id, x: xx, y, width, height, isFirst, isLast, available };
        }
        if (isFirst) {
          first = { id, x: xx, y, width, height, isFirst, isLast, available };
        } else if (isLast) {
          last = { id, x: xx, y, width, height, isFirst, isLast, available };
        }
      }
    }
    if (positionX < 0 && positionY < 0) {
      return first;
    }
    if ((maxPositionX !== null && positionX > maxPositionX) && (maxPositionY !== null && positionY > maxPositionY)) {
      return last;
    }
    return null;
  }

  override getAccessibilityOfMovement(positionX: number, positionY: number, maxPositionX: number | null = null, maxPositionY: number | null = null): boolean {
    const bounds = this.bounds;
    if (!bounds) {
      return false;
    }
    const breakpointsLT = this.getBreakpointsByIntersectionPosition(positionX + MIN_TRACE_VALUE, positionY + MIN_TRACE_VALUE, maxPositionX, maxPositionY),
      breakpointsRT = this.getBreakpointsByIntersectionPosition(positionX + bounds.width - MAX_TRACE_VALUE, positionY + MIN_TRACE_VALUE, maxPositionX, maxPositionY),
      breakpointsRB = this.getBreakpointsByIntersectionPosition(positionX + bounds.width - MAX_TRACE_VALUE, positionY + bounds.height - MAX_TRACE_VALUE, maxPositionX, maxPositionY),
      breakpointsLB = this.getBreakpointsByIntersectionPosition(positionX + MAX_TRACE_VALUE, positionY + bounds.height - MAX_TRACE_VALUE, maxPositionX, maxPositionY);
    return ((!breakpointsLT || breakpointsLT.available) && (!breakpointsRT || breakpointsRT.available) &&
      (!breakpointsRB || breakpointsRB.available) && (!breakpointsLB || breakpointsLB.available)) as any;
  }

  /**
   * Scrolls the scroll area to the first item in the collection.
   */
  scrollToLeft(options?: IScrollOptions) { }

  /**
   * Scrolls the list to the end of the content size.
   */
  scrollToRight(options?: IScrollOptions) { }

  /**
   * Scrolls the scroll area to the first item in the collection.
   */
  scrollToTop(options?: IScrollOptions) { }

  /**
   * Scrolls the list to the end of the content size.
   */
  scrollToBottom(options?: IScrollOptions) { }

  focus(element: HTMLElement) {
    if (!!element) {
      this._$focusedElement.next(element);
    }
  }
}
