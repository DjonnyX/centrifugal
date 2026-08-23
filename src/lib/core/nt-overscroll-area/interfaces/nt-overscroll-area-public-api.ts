import { Observable } from "rxjs";

/**
 * INtOverscrollAreaPublicApi
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/core/nt-overscroll-area/interfaces/nt-overscroll-area-public-api.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtOverscrollAreaPublicApi {
    /**
     * Fires when the overscroll area has reached its position limit.
     */
    get $trigger(): Observable<boolean>;
}