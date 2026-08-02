import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { INtOverscrollIndicatorPublicApi } from "./interfaces";

/**
 * NtOverscrollIndicatorService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-overscroll-indicator/nt-overscroll-indicator.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
    providedIn: 'root',
})
export class NtOverscrollIndicatorService implements INtOverscrollIndicatorPublicApi {
    private _$trigger = new Subject<boolean>();
    readonly $trigger = this._$trigger.asObservable();

    trigger(v: boolean) {
        this._$trigger?.next(v);
    }
}
