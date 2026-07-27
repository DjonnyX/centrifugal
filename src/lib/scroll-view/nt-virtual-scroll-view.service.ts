import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { combineLatest, distinctUntilChanged, Subject, tap } from 'rxjs';
import { IAnimationParams, IScrollOptions, INtScrollViewService } from './interfaces';
import { Directions } from './enums';
import { Direction } from './types';
import { DEFAULT_ANIMATION_PARAMS, DEFAULT_CLICK_DISTANCE } from './const';
import { Id, IRect, TextDirection, TextDirections } from '../common';

/**
 * NtVirtualScrollViewService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-virtual-scroll-view.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtVirtualScrollViewService implements INtScrollViewService, OnDestroy {
  private _id: number = 0;
  get id() { return this._id; }

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

  private _$langTextDir = new BehaviorSubject<TextDirection>(TextDirections.LTR);
  readonly $langTextDir = this._$langTextDir.asObservable();
  get langTextDir() { return this._$langTextDir.getValue(); }

  set langTextDir(v: TextDirection) {
    if (this.langTextDir === v) {
      return;
    }

    this._$langTextDir.next(v);
  }

  private _$grabbing = new BehaviorSubject<boolean>(false);
  readonly $grabbing = this._$grabbing.asObservable();
  get grabbing() { return this._$grabbing.getValue(); }

  set grabbing(v: boolean) {
    if (this.grabbing === v) {
      return;
    }
    this._$grabbing.next(v);
  }

  private _$clickPressed = new BehaviorSubject<boolean>(false);
  readonly $clickPressed = this._$clickPressed.asObservable();
  get clickPressed() { return this._$clickPressed.getValue(); }

  set clickPressed(v: boolean) {
    if (this.clickPressed === v) {
      return;
    }

    this._$clickPressed.next(v);
  }

  private _$isGrabbing = new BehaviorSubject<boolean>(false);
  readonly $isGrabbing = this._$isGrabbing.asObservable();
  get isGrabbing() { return this._$isGrabbing.getValue(); }

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

  private _$clickDistance = new BehaviorSubject<number>(DEFAULT_CLICK_DISTANCE);
  readonly $clickDistance = this._$clickDistance.asObservable();
  get clickDistance() { return this._$clickDistance.getValue(); }

  set clickDistance(v: number) {
    if (this.clickDistance === v) {
      return;
    }

    this._$clickDistance.next(v);
  }

  private _$scrollableX = new BehaviorSubject<boolean>(false);
  readonly $scrollableX = this._$scrollableX.asObservable();
  get scrollableX() { return this._$scrollableX.getValue(); }

  set scrollableX(v: boolean) {
    if (this.scrollableX === v) {
      return;
    }

    this._$scrollableX.next(v);
  }

  private _$scrollableY = new BehaviorSubject<boolean>(false);
  readonly $scrollableY = this._$scrollableY.asObservable();
  get scrollableY() { return this._$scrollableY.getValue(); }

  set scrollableY(v: boolean) {
    if (this.scrollableY === v) {
      return;
    }

    this._$scrollableY.next(v);
  }

  private _tickerId: number | null = null;

  constructor() {
    const $grabbing = this.$grabbing.pipe(
      takeUntilDestroyed(),
      distinctUntilChanged(),
    ), $clickPressed = this.$clickPressed.pipe(
      takeUntilDestroyed(),
      distinctUntilChanged(),
    );
    combineLatest([$grabbing, $clickPressed]).pipe(
      takeUntilDestroyed(),
      tap(([grabbing, clickPressed]) => {
        this._$isGrabbing.next(grabbing && !clickPressed);
      }),
    ).subscribe();

    this.tick();
  }

  private tick() {
    this._$tick.next();

    this._tickerId = requestAnimationFrame(() => {
      this.tick();
    });
  }

  initialize(id: number) {
    this._id = id;
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

  ngOnDestroy() {
    if (this._tickerId !== null) {
      cancelAnimationFrame(this._tickerId);
      this._tickerId = null;
    }
  }
}
