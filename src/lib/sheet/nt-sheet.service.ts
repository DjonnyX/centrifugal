import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { INtSheetAnimationParams, INtSheetService } from './interfaces';
import { SheetPositions } from './enums';
import { Direction, SheetPosition } from './types';
import { DEFAULT_ANIMATION_PARAMS } from './const';
import { NtBaseScrollViewService } from '../common/services/nt-base-scroll-view.service';
import { INtBaseScrollViewService } from '../common/interfaces/nt-base-scroll-view-service';
import { INtScroller } from '../common/interfaces/nt-scroller';
import { Directions, Id, IRect, IScrollOptions } from '../common';
import { ISheetPrecalculatedBreakpoints } from './interfaces';

/**
 * NtSheetService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/nt-sheet.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtSheetService extends NtBaseScrollViewService implements INtSheetService {
  scrollStartOffset: number = 0;

  scrollEndOffset: number = 0;

  isVertical: boolean = true;

  direction: Direction = this.isVertical ? Directions.VERTICAL : Directions.HORIZONTAL;

  animationParams: INtSheetAnimationParams = DEFAULT_ANIMATION_PARAMS;

  position: SheetPosition = SheetPositions.BOTTOM;

  breakpoints: ISheetPrecalculatedBreakpoints | null = null;

  private _$scrollBarSize = new BehaviorSubject<number>(0);
  readonly $scrollBarSize = this._$scrollBarSize.asObservable();
  get scrollBarSize() { return this._$scrollBarSize.getValue(); }

  set scrollBarSize(v: number) {
    if (this.scrollBarSize === v) {
      return;
    }

    this._$scrollBarSize.next(v);
  }

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

  override getComponentBoundsByIntersectionPosition(position: number, maxPosition: number | null = null):
    (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; }) | null {
    const breakpointItems = this.breakpoints;
    let first: (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; }) | null = null,
      last: (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; }) | null = null;
    if (!!breakpointItems) {
      for (let i = 0, l = breakpointItems.length; i < l; i++) {
        const breakpoint = breakpointItems[i],
          id = breakpoint.id ?? null, isVertical = breakpoint.config.isVertical,
          inverted = breakpoint.config.inverted ?? false,
          maxScrollSize = breakpoint.measures.maxScrollSize ?? 0,
          { width, height } = breakpoint.bounds,
          x = breakpoint.measures.x ?? 0,
          xx = inverted ? (maxScrollSize - x) - width : x,
          y = breakpoint.measures?.y ?? 0,
          isFirst = breakpoint.config.isFirst ?? false,
          isLast = breakpoint.config.isLast ?? false,
          pos = position;
        if (isVertical && (pos >= y && pos < y + height)) {
          return { id, x: xx, y, width, height, isFirst, isLast };
        } else if (!isVertical && (pos >= xx && pos < xx + width)) {
          return { id, x: xx, y, width, height, isFirst, isLast };
        }
        if (isFirst) {
          first = { id, x: xx, y, width, height, isFirst, isLast };
        } else if (isLast) {
          last = { id, x: xx, y, width, height, isFirst, isLast };
        }
      }
    }
    if (position < 0) {
      return first;
    }
    if (maxPosition !== null && position > maxPosition) {
      return last;
    }
    return null;
  }

  override setIntersectionElementBySnapToItemAlign(id: Id | null) {
    if (this._$intersectionElementBySnapToItemAlign.getValue() !== id) {
      this._$intersectionElementBySnapToItemAlign.next(id);
    }
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
}
