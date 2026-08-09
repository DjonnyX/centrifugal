import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { INtOverscrollAreaPublicApi } from "./interfaces";

/**
 * NtOverscrollAreaService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-overscroll-area/nt-overscroll-area.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
    providedIn: 'root',
})
export class NtOverscrollAreaService implements INtOverscrollAreaPublicApi {
    private _$trigger = new Subject<boolean>();
    readonly $trigger = this._$trigger.asObservable();

    trigger(v: boolean) {
        this._$trigger?.next(v);
    }
}
