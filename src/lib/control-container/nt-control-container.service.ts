import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Id, IRect } from '../common';
import { INtControlContainerService } from './interfaces';

/**
 * NtControlContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-virtual-scroll-view.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtControlContainerService implements INtControlContainerService, OnDestroy {
  private _id: number = 0;
  get id() { return this._id; }

  private _nextComponentId: number = 0;

  private _emitter: HTMLElement = window as unknown as HTMLElement;
  get emitter() {
    return this._emitter;
  }

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

  constructor() { }

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

  focus(element: HTMLElement) {
    if (!!element) {
      this._$focusedElement.next(element);
    }
  }

  ngOnDestroy() {

  }
}
