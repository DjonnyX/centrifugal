import { NgControl } from "@angular/forms";
import { Observable } from "rxjs";
import { INtBaseScrollViewService } from "./nt-base-scroll-view-service";
import { IFocusedObject } from "./focused-object";

/**
 * INtBaseControlContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/nt-base-control-container-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtBaseControlContainerService extends INtBaseScrollViewService {
    get emitter(): HTMLElement;

    readonly $keyboardEnabled: Observable<boolean>;
    get keyboardEnabled(): boolean;

    readonly $focusedElement: Observable<IFocusedObject | null>;
    get focusedElement(): IFocusedObject | null;

    readonly $overscrollCanceled: Observable<IFocusedObject | null>;
    get overscrollCanceled(): IFocusedObject | null;

    readonly $focusEcho: Observable<{ element: HTMLElement, ngControl: NgControl | null, serviceId: number }>;

    initialize: (id: number, parentId: number, emitter: HTMLElement) => void;

    focusEcho: (element: HTMLElement, ngControl: NgControl | null, serviceId: number) => void;

    focus: (object: IFocusedObject) => void;

    overscrollCancel: (object: IFocusedObject) => void;
}