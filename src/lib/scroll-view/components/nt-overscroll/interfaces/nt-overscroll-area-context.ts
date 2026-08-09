import { IOverscrollEvent, ISize } from "../../../../common";
import { OverscrollAreaType } from "../../../../common/types/overscroll-area-type";
import { INtOverscrollAreaPublicApi } from "../../nt-overscroll-area/interfaces";

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