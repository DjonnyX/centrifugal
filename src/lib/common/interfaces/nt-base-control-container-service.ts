import { Observable } from "rxjs";

/**
 * INtBaseControlContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/nt-base-control-container-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtBaseControlContainerService {
    get id(): number;

    get emitter(): HTMLElement;

    set overscrollXApplied(v: boolean);

    get overscrollXApplied(): boolean;

    set overscrollYApplied(v: boolean);

    get overscrollYApplied(): boolean;

    readonly $focusedElement: Observable<HTMLElement | null>;

    initialize: (id: number, emitter: HTMLElement) => void;

    focus: (element: HTMLElement) => void;
}