import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ScrollbarState } from './types';
import { ScrollbarStates } from './enums';

/**
 * NtBaseScrollBarService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-bar/components/nt-base-scroll-bar/nt-base-scroll-bar.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtBaseScrollBarService {
  private _$click = new Subject<PointerEvent | MouseEvent>();
  readonly $click = this._$click.asObservable();

  private _$state = new BehaviorSubject<ScrollbarState>(ScrollbarStates.NORMAL);
  readonly $state = this._$state.asObservable();

  set state(v: ScrollbarState) {
    if (this._$state.getValue() !== v) {
      this._$state.next(v);
    }
  }
  get state() { return this._$state.getValue(); }

  click(event: PointerEvent | MouseEvent) {
    this._$click.next(event);
  }
}
