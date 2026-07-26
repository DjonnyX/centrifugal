import { Injectable, OnDestroy } from '@angular/core';
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
  };

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

  ngOnDestroy() {

  }
}
