import { Observable } from "rxjs";

/**
 * INtOverscrollIndicatorPublicApi
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-overscroll-indicator/interfaces/nt-overscroll-indicator-public-api.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtOverscrollIndicatorPublicApi {
    /**
     * Fires when the overscroll indicator has reached its position limit.
     */
    get $trigger(): Observable<boolean>;
}