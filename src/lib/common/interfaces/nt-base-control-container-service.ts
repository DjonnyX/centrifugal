import { Observable } from "rxjs";
import { IBaseScrollViewService } from "./base-scroll-view-service";
import { IFocusedObject } from "./focused-object";

/**
 * INtBaseControlContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/nt-base-control-container-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtBaseControlContainerService extends IBaseScrollViewService {
    get emitter(): HTMLElement;

    readonly $focusedElement: Observable<IFocusedObject | null>;
    get focusedElement(): IFocusedObject | null;

    readonly $overscrollCanceled: Observable<IFocusedObject | null>;
    get overscrollCanceled(): IFocusedObject | null;

    readonly $focusEcho: Observable<{ element: HTMLElement, serviceId: number }>;

    initialize: (id: number, parentId: number, emitter: HTMLElement) => void;

    focusEcho: (element: HTMLElement, serviceId: number) => void;

    focus: (object: IFocusedObject) => void;

    overscrollCancel: (object: IFocusedObject) => void;
}