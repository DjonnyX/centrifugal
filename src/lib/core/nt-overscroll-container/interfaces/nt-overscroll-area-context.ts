import { IOverscrollEvent, ISize } from "../../../common";
import { OverscrollAreaType } from "../../../common/types/overscroll-area-type";
import { INtOverscrollAreaPublicApi } from "../../nt-overscroll-area/interfaces";

/**
 * INtOverscrollAreaContext
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/core/nt-overscroll-interfaces/nt-overscroll-area-context.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtOverscrollAreaContext {
    api: INtOverscrollAreaPublicApi;
    bounds: ISize;
    overscrollEvent: IOverscrollEvent | null;
    leftOffset: number;
    topOffset: number;
    rightOffset: number;
    bottomOffset: number;
    enabled: boolean;
    type: OverscrollAreaType;
}