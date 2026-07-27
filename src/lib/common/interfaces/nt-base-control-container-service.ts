import { Observable } from "rxjs";
import { IBaseScrollViewService } from "./base-scroll-view-service";

/**
 * INtBaseControlContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/nt-base-control-container-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtBaseControlContainerService extends IBaseScrollViewService {
    get emitter(): HTMLElement;

    readonly $focusedElement: Observable<HTMLElement | null>;

    initialize: (id: number, emitter: HTMLElement) => void;

    focus: (element: HTMLElement) => void;
}