import { inject, Injectable } from '@angular/core';
import { NtBaseSliderService } from './nt-base-slider.service';

/**
 * NtSliderService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/slider/components/nt-base-slider/nt-base-slider-public.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtBaseSliderPublicService {
  private _internalService = inject(NtBaseSliderService);

  get $click() { return this._internalService.$click; }

  get $state() { return this._internalService.$state; }
}
