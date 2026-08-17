import { Injectable } from '@angular/core';
import { INtBaseScrollViewService } from '../common/interfaces/nt-base-scroll-view-service';
import { NtBaseScrollViewService } from '../common/services/nt-base-scroll-view.service';

/**
 * NtControlContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-scroll-view.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtSliderService extends NtBaseScrollViewService implements INtBaseScrollViewService {
  private _emitter: HTMLElement = window as unknown as HTMLElement;
  get emitter() {
    return this._emitter;
  }

  constructor() {
    super();
  }

  initialize(id: number, emitter: HTMLElement) {
    this._id = id;
    this._emitter = emitter;
  }
}
