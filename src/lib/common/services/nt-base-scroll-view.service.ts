import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { combineLatest, distinctUntilChanged, tap } from 'rxjs';
import { IScrollable } from '../interfaces/scrollable';
import { Id, TextDirection } from '../types';
import { TextDirections } from '../enums';
import { DEFAULT_CLICK_DISTANCE } from '../directives/nt-control/const';
import { IOverscroll } from '../interfaces/overscroll';
import { INtBaseScrollViewService } from '../interfaces/nt-base-scroll-view-service';
import { INtScroller } from '../interfaces/nt-scroller';
import { IRect } from '../interfaces';
import { NtService } from './nt.service';

/**
 * NtBaseScrollViewService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/services/nt-base-scroll-view.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtBaseScrollViewService implements INtBaseScrollViewService {
  protected _nextComponentId: number = 0;

  protected _id: number = 0;
  get id() { return this._id; }

  protected _parentId: number = -1;
  get parentId() { return this._parentId; }

  protected _parent!: INtBaseScrollViewService;
  get parent() { return this._parent; }

  protected _scrollView!: INtScroller<INtBaseScrollViewService>;
  get scrollView() { return this._scrollView; }

  protected _$langTextDir = new BehaviorSubject<TextDirection>(TextDirections.LTR);
  readonly $langTextDir = this._$langTextDir.asObservable();
  get langTextDir() { return this._$langTextDir.getValue(); }

  set langTextDir(v: TextDirection) {
    if (this.langTextDir === v) {
      return;
    }

    this._$langTextDir.next(v);
  }

  protected _$grabbing = new BehaviorSubject<boolean>(false);
  readonly $grabbing = this._$grabbing.asObservable();
  get grabbing() { return this._$grabbing.getValue(); }

  set grabbing(v: boolean) {
    if (this.grabbing === v) {
      return;
    }
    this._$grabbing.next(v);
  }

  protected _$isGrabbing = new BehaviorSubject<boolean>(false);
  readonly $isGrabbing = this._$isGrabbing.asObservable();
  get isGrabbing() { return this._$isGrabbing.getValue(); }

  protected _$clickPressed = new BehaviorSubject<boolean>(false);
  readonly $clickPressed = this._$clickPressed.asObservable();
  get clickPressed() { return this._$clickPressed.getValue(); }

  set clickPressed(v: boolean) {
    if (this.clickPressed === v) {
      return;
    }

    this._$clickPressed.next(v);
  }

  protected _$clickDistance = new BehaviorSubject<number>(DEFAULT_CLICK_DISTANCE);
  readonly $clickDistance = this._$clickDistance.asObservable();
  get clickDistance() { return this._$clickDistance.getValue(); }

  set clickDistance(v: number) {
    if (this.clickDistance === v) {
      return;
    }

    this._$clickDistance.next(v);
  }

  protected _$scrollable = new BehaviorSubject<IScrollable>({ x: false, y: false });
  readonly $scrollable = this._$scrollable.asObservable();
  get scrollable() { return this._$scrollable.getValue(); }

  set scrollable(v: IScrollable) {
    if (this.scrollable === v) {
      return;
    }

    this._$scrollable.next(v);
  }

  protected _$overscroll = new BehaviorSubject<IOverscroll>({ x: false, y: false });
  readonly $overscroll = this._$overscroll.asObservable();
  get overscroll() { return this._$overscroll.getValue(); }

  set overscroll(v: IOverscroll) {
    if (this.overscroll === v) {
      return;
    }

    this._$overscroll.next(v);
  }

  protected _ntService = inject(NtService);

  $tick = this._ntService.$tick;

  protected _$intersectionElementBySnapToItemAlign = new BehaviorSubject<Id | null>(null);
  readonly $intersectionElementBySnapToItemAlign = this._$intersectionElementBySnapToItemAlign.asObservable();

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
  }

  generateComponentId() {
    return this._nextComponentId = this._nextComponentId === Number.MAX_SAFE_INTEGER
      ? 0 : this._nextComponentId + 1;
  }

  update(immediately: boolean = false) { }

  getComponentBoundsByIntersectionPosition(positionX: number, positionY: number, maxPositionX: number | null = null, maxPositionY: number | null = null):
    (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; }) | null {
    return null;
  }

  setIntersectionElementBySnapToItemAlign(id: Id | null) {
    if (this._$intersectionElementBySnapToItemAlign.getValue() !== id) {
      this._$intersectionElementBySnapToItemAlign.next(id);
    }
  }

  getAccessibilityOfMovement(positionX: number, positionY: number, maxPositionX: number | null = null, maxPositionY: number | null = null): boolean {
    return true;
  }
}
