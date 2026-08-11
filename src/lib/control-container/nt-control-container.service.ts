import { DestroyRef, inject, Injectable, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BehaviorSubject, map, skip, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { Id, IRect, KeyboardKeyValue } from '../common';
import { INtControlContainerService } from './interfaces';
import { NtBaseScrollViewService } from '../common/services/nt-base-scroll-view.service';
import { INtBaseScrollViewService } from '../common/interfaces/nt-base-scroll-view-service';
import { INtScroller } from '../common/interfaces/nt-scroller';
import { IFocusedObject } from '../common/interfaces/focused-object';
import { DEFAULT_KEYBOARD_ENABLED } from './const';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  protected _$input = new BehaviorSubject<KeyboardKeyValue | null>(null);
  readonly $input = this._$input.asObservable();
  set input(v: KeyboardKeyValue | null) {
    this._$input.next(v);
  }
  get input() { return this._$input.getValue(); }

  focusedScroller: INtScroller<INtBaseScrollViewService> | null = null;

  private _$keyboardEnabled = new BehaviorSubject<boolean>(DEFAULT_KEYBOARD_ENABLED);
  readonly $keyboardEnabled = this._$keyboardEnabled.asObservable();
  set keyboardEnabled(v: boolean) {
    if (this.keyboardEnabled !== v) {
      this._$keyboardEnabled.next(v);
    }
  }
  get keyboardEnabled() {
    return this._$keyboardEnabled.getValue();
  }

  private _$focusEcho = new Subject<{ element: HTMLElement, ngControl: NgControl | null, serviceId: number }>();
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

    const $focusEcho = this.$focusEcho,
      $focusedElement = this.$focusedElement;
    $focusEcho.pipe(
      takeUntilDestroyed(),
      switchMap(() => {
        return timer(200).pipe(
          takeUntilDestroyed(this._destroyRef),
          takeUntil($focusedElement.pipe(
            takeUntilDestroyed(this._destroyRef),
            skip(1),
          )),
          map(() => true),
        )
      }),
      tap(() => {
        this._$focusedElement.next({ id: -1, element: null, type: null, scroller: null, ngControl: null });
      }),
    ).subscribe();
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

  focusEcho(element: HTMLElement, ngControl: NgControl | null, serviceId: number) {
    this._$focusEcho.next({ element, ngControl, serviceId });
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
