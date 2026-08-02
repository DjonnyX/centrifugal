import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { INtOverscrollIndicatorService } from "./interfaces";

/**
 * NtOverscrollIndicatorService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-overscroll-indicator/nt-overscroll-indicator.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
    providedIn: 'root',
})
export class NtOverscrollIndicatorService  implements INtOverscrollIndicatorService {
    private _$pinned = new BehaviorSubject<boolean>(false);
    readonly $pinned = this._$pinned.asObservable();

    pin() {
        this._$pinned?.next(true);
    }

    unpin() {
        this._$pinned?.next(false);
    }
}
