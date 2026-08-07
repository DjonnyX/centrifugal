import { DestroyRef, inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Id, IRect } from '../common';
import { INtControlContainerService } from './interfaces';
import { NtBaseScrollViewService } from '../common/services/nt-base-scroll-view.service';
import { INtBaseScrollViewService } from '../common/interfaces/nt-base-scroll-view-service';
import { INtScroller } from '../common/interfaces/nt-scroller';
import { IFocusedObject } from '../common/interfaces/focused-object';

/**
 * NtControlContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-scroll-view.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtControlContainerService extends NtBaseScrollViewService implements INtBaseScrollViewService, INtControlContainerService, OnDestroy {
  private _nextComponentId: number = 0;

  private _emitter: HTMLElement = window as unknown as HTMLElement;
  get emitter() {
    return this._emitter;
  }

  focusedScroller: INtScroller<INtBaseScrollViewService> | null = null;

  private _$focusEcho = new Subject<{ element: HTMLElement, serviceId: number }>();
  readonly $focusEcho = this._$focusEcho.asObservable();

  private _$focusedElement = new BehaviorSubject<IFocusedObject | null>(null);
  readonly $focusedElement = this._$focusedElement.asObservable();
  get focusedElement() {
    return this._$focusedElement.getValue();
  }

  private _$overscrollCanceled = new BehaviorSubject<IFocusedObject | null>(null);
  readonly $overscrollCanceled = this._$overscrollCanceled.asObservable();
  get overscrollCanceled() {
    return this._$overscrollCanceled.getValue();
  }

  protected _destroyRef = inject(DestroyRef);

  constructor() {
    super();
  }

  initialize(id: number, parentId: number, emitter: HTMLElement) {
    this._id = id;
    this._parentId = parentId;
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

  focusEcho(element: HTMLElement, serviceId: number) {
    this._$focusEcho.next({ element, serviceId });
  }

  focus(focusedObject: IFocusedObject) {
    if (!!focusedObject) {
      this._$focusedElement.next(focusedObject);
    }
  }

  overscrollCancel(focusedObject: IFocusedObject) {
    this._$overscrollCanceled.next(focusedObject);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this._$focusedElement.next(null);

    this.focusedScroller = null;
  }
}
