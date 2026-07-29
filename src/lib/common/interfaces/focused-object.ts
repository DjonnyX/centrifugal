import { IBaseScrollViewService } from "./base-scroll-view-service";
import { INtScroller } from "./nt-scroller";

/**
 * IFocusedObject
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/focused-object.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IFocusedObject {
    element: HTMLElement;
    scroller: INtScroller<IBaseScrollViewService> | null;
}