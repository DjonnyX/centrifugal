import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Id, IRect } from '../common';
import { INtControlContainerService } from './interfaces';
import { NtBaseScrollViewService } from '../common/services/nt-base-scroll-view.service';
import { IBaseScrollViewService } from '../common/interfaces/base-scroll-view-service';

/**
 * NtControlContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-virtual-scroll-view.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtControlContainerService extends NtBaseScrollViewService implements IBaseScrollViewService, INtControlContainerService, OnDestroy {
  private _nextComponentId: number = 0;

  private _emitter: HTMLElement = window as unknown as HTMLElement;
  get emitter() {
    return this._emitter;
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

  focus(element: HTMLElement) {
    if (!!element) {
      this._$focusedElement.next(element);
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
