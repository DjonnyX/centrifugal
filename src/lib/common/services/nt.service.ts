import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

/**
 * NtService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/services/nt.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtService {
  protected _tickerId: number | null = null;

  protected _$tick = new Subject<void>();
  readonly $tick = this._$tick.asObservable();

  constructor() {
    this.tick();
  }

  private tick() {
    this._$tick.next();

    this._tickerId = requestAnimationFrame(() => {
      this.tick();
    });
  }
}
