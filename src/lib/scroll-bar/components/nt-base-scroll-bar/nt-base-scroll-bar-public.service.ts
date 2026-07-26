import { inject, Injectable } from '@angular/core';
import { NtBaseScrollBarService } from './nt-base-scroll-bar.service';

/**
 * NtScrollBarService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-scroll-bar/nt-scroll-bar-public.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtScrollBarPublicService {
  private _internalService = inject(NtBaseScrollBarService);

  get $click() { return this._internalService.$click; }

  get $state() { return this._internalService.$state; }
}
