import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { INtDrawerContainerService } from './interfaces/drawer-container-service';
import { DEFAULT_ANIMATION_PARAMS } from '../scroll-view/const';
import { IAnimationParams } from '../scroll-view';
import { NtBaseScrollViewService } from '../common/services/nt-base-scroll-view.service';
import { INtBaseScrollViewService } from '../common/interfaces/nt-base-scroll-view-service';
import { Direction, Directions, IScrollOptions } from '../common';

/**
 * NtDrawerContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/drawer-container/nt-drawer-container.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtDrawerContainerService extends NtBaseScrollViewService implements INtBaseScrollViewService, INtDrawerContainerService, OnDestroy {
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

  initialize(id: number, parentId: number, emitter: HTMLElement) {
    this._id = id;
    this._parentId = parentId;
    this._emitter = emitter;
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

  override ngOnDestroy() {
    super.ngOnDestroy();

    if (this._tickerId !== null) {
      cancelAnimationFrame(this._tickerId);
      this._tickerId = null;
    }
  }
}
