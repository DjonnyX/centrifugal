import { Injectable } from '@angular/core';
import { INtBaseScrollViewService } from '../common/interfaces/nt-base-scroll-view-service';
import { NtBaseScrollViewService } from '../common/services/nt-base-scroll-view.service';
import { INtScroller } from '../common/interfaces/nt-scroller';
import { Id, IRect } from '../common';
import { ISliderSteps, INtSliderService } from './interfaces';

/**
 * NtControlContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-scroll-view.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtSliderService extends NtBaseScrollViewService implements INtSliderService {
  private _emitter: HTMLElement = window as unknown as HTMLElement;
  get emitter() {
    return this._emitter;
  }

  steps: ISliderSteps | null = null;

  constructor() {
    super();

    this.tick();
  }

  private tick() {
    this._$tick.next();

    this._tickerId = requestAnimationFrame(() => {
      this.tick();
    });
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
    const breakpointItems = this.steps;
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
          return { id, x, y, width, height, isFirst, isLast };
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

  override ngOnDestroy() {
    super.ngOnDestroy();

    if (this._tickerId !== null) {
      cancelAnimationFrame(this._tickerId);
      this._tickerId = null;
    }
  }
}