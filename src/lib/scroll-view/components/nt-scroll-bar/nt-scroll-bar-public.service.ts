import { inject, Injectable } from '@angular/core';
import { NtScrollBarService } from './nt-scroll-bar.service';

/**
 * NtScrollBarService
 * Maximum performance for extremely large lists.
 * It is based on algorithms for virtualization of screen objects.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-scroll-bar/nt-scroll-bar-public.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtScrollBarPublicService {
  private _internalService = inject(NtScrollBarService);

  get $click() { return this._internalService.$click; }

  get $state() { return this._internalService.$state; }
}
