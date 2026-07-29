import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs';
import { IAnimationParams, IScrollOptions, INtScrollViewService } from './interfaces';
import { Directions } from './enums';
import { Direction } from './types';
import { DEFAULT_ANIMATION_PARAMS } from './const';
import { Id, IRect } from '../common';
import { NtBaseScrollViewService } from '../common/services/nt-base-scroll-view.service';
import { IBaseScrollViewService } from '../common/interfaces/base-scroll-view-service';
import { IBaseScrollView } from '../common/interfaces/base-scroll-view';
import { INtScroller } from '../common/interfaces/nt-scroller';

/**
 * NtScrollViewService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-scroll-view.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtScrollViewService extends NtBaseScrollViewService implements INtScrollViewService, OnDestroy {
  private _nextComponentId: number = 0;

  private _$tick = new Subject<void>();
  readonly $tick = this._$tick.asObservable();

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

  animationParams: IAnimationParams = DEFAULT_ANIMATION_PARAMS;

  direction: Direction = Directions.BOTH;

  private _$scrollBarSize = new BehaviorSubject<number>(0);
  readonly $scrollBarSize = this._$scrollBarSize.asObservable();
  get scrollBarSize() { return this._$scrollBarSize.getValue(); }

  set scrollBarSize(v: number) {
    if (this.scrollBarSize === v) {
      return;
    }

    this._$scrollBarSize.next(v);
  }

  private _$intersectionElementBySnapToItemAlign = new BehaviorSubject<Id | null>(null);
  readonly $intersectionElementBySnapToItemAlign = this._$intersectionElementBySnapToItemAlign.asObservable();

  private _tickerId: number | null = null;

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

  initialize(id: number, scrollView: INtScroller<IBaseScrollViewService>, parentService: IBaseScrollViewService) {
    this._id = id;
    this._scrollView = scrollView;
    console.log('init sv', id , scrollView);
    this._parent = parentService;
    this._parentId = parentService.id;
  }

  generateComponentId() {
    return this._nextComponentId = this._nextComponentId === Number.MAX_SAFE_INTEGER
      ? 0 : this._nextComponentId + 1;
  }

  getComponentBoundsByIntersectionPosition(positionX: number, positionY: number, maxPositionX: number | null = null, maxPositionY: number | null = null):
    (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; }) | null {
    return null;
  }

  setIntersectionElementBySnapToItemAlign(id: Id | null) {
    if (this._$intersectionElementBySnapToItemAlign.getValue() !== id) {
      this._$intersectionElementBySnapToItemAlign.next(id);
    }
  }

  update(immediately: boolean = false) { }

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

  override ngOnDestroy() {
    super.ngOnDestroy();

    if (this._tickerId !== null) {
      cancelAnimationFrame(this._tickerId);
      this._tickerId = null;
    }
  }
}
