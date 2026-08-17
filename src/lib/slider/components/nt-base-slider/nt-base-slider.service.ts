import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SliderState } from './types';
import { SliderStates } from './enums';

/**
 * NtBaseSliderService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-bar/components/nt-base-slider/nt-base-slider.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtBaseSliderService {
  private _$click = new Subject<PointerEvent | MouseEvent>();
  readonly $click = this._$click.asObservable();

  private _$state = new BehaviorSubject<SliderState>(SliderStates.NORMAL);
  readonly $state = this._$state.asObservable();

  set state(v: SliderState) {
    if (this._$state.getValue() !== v) {
      this._$state.next(v);
    }
  }
  get state() { return this._$state.getValue(); }

  click(event: PointerEvent | MouseEvent) {
    this._$click.next(event);
  }
}
