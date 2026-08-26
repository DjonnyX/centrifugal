import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { IOverscrollEvent } from "../interfaces";
import { INtOverscrollService } from "../interfaces/nt-overscroll-service";

/**
 * NtOverscrollService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/services/nt-overscroll.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtOverscrollService implements INtOverscrollService {
  protected _$event = new Subject<IOverscrollEvent>();
  readonly $event = this._$event.asObservable();

  protected _$effectEvent = new Subject<IOverscrollEvent>();
  readonly $effectEvent = this._$effectEvent.asObservable();

  emit(event: IOverscrollEvent, effect: boolean = false) {
    if (effect) {
      this._$effectEvent.next(event);
    } else {
      this._$event.next(event);
    }
  }
}
