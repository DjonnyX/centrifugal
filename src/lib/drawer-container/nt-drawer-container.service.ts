import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs';
import { Id, IRect } from '../common';
import { INtDrawerContainerService } from './interfaces/drawer-container-service';
import { DEFAULT_ANIMATION_PARAMS } from '../scroll-view/const';
import { Direction, Directions, IAnimationParams, IScrollOptions } from '../scroll-view';
import { NtBaseScrollViewService } from '../common/services/nt-base-scroll-view.service';
import { IBaseScrollViewService } from '../common/interfaces/base-scroll-view-service';

/**
 * NtDrawerContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-drawer-container.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtDrawerContainerService extends NtBaseScrollViewService implements IBaseScrollViewService, INtDrawerContainerService, OnDestroy {
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

  private _tickerId: number | null = null;

  private _emitter: HTMLElement = window as unknown as HTMLElement;
  get emitter() {
    return this._emitter;
  };

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

  initialize(id: number, emitter: HTMLElement) {
    this._id = id;
    this._emitter = emitter;
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

  focus(element: HTMLElement) {
    if (!!element) {
      this._$focusedElement.next(element);
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
