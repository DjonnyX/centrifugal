import { Observable } from "rxjs";
import { IOverscrollEvent } from "./overscroll-event";

/**
 * INtOverscrollService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/nt-overscroll-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtOverscrollService {
    $event: Observable<IOverscrollEvent>;

    $effectEvent: Observable<IOverscrollEvent>;

    emit(event: IOverscrollEvent, effect?: boolean): void;
}