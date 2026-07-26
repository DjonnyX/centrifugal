import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { combineLatest, distinctUntilChanged, Subject, tap } from 'rxjs';
import { Id, IRect, TextDirection, TextDirections } from '../common';
import { INtDrawerContainerService } from './interfaces/drawer-container-service';
import { DEFAULT_ANIMATION_PARAMS, DEFAULT_CLICK_DISTANCE } from '../scroll-view/const';
import { Direction, Directions, IAnimationParams, IScrollOptions } from '../scroll-view';

/**
 * NtDrawerContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-drawer-container.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtDrawerContainerService implements INtDrawerContainerService, OnDestroy {
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

  private _$overscrollXApplied = new BehaviorSubject<boolean>(false);
  readonly $overscrollXApplied = this._$overscrollXApplied.asObservable();
  set overscrollXApplied(v: boolean) {
    if (this._$overscrollXApplied.getValue() !== v) {
      this._$overscrollXApplied.next(v);
    }
  }
  get overscrollXApplied() {
    return this._$overscrollXApplied.getValue();
  }

  private _$overscrollYApplied = new BehaviorSubject<boolean>(false);
  readonly $overscrollYApplied = this._$overscrollYApplied.asObservable();
  set overscrollYApplied(v: boolean) {
    if (this._$overscrollYApplied.getValue() !== v) {
      this._$overscrollYApplied.next(v);
    }
  }
  get overscrollYApplied() {
    return this._$overscrollYApplied.getValue();
  }

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

  ngOnDestroy() {
    if (this._tickerId !== null) {
      cancelAnimationFrame(this._tickerId);
      this._tickerId = null;
    }
  }
}
