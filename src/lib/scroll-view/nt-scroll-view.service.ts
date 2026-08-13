import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { IAnimationParams, INtScrollViewService } from './interfaces';
import { DEFAULT_ANIMATION_PARAMS } from './const';
import { NtBaseScrollViewService } from '../common/services/nt-base-scroll-view.service';
import { INtBaseScrollViewService } from '../common/interfaces/nt-base-scroll-view-service';
import { INtScroller } from '../common/interfaces/nt-scroller';
import { Direction, Directions, IScrollOptions } from '../common';

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
  scrollLeftOffset: number = 0;

  scrollRightOffset: number = 0;

  scrollTopOffset: number = 0;

  scrollBottomOffset: number = 0;

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
