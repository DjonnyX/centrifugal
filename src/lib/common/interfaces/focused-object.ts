import { INtBaseScrollViewService } from "./nt-base-scroll-view-service";
import { INtScroller } from "./nt-scroller";

/**
 * IFocusedObject
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/focused-object.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IFocusedObject {
    id: number;
    type: string;
    element: HTMLElement;
    scroller: INtScroller<INtBaseScrollViewService> | null;
    animated?: boolean;
}