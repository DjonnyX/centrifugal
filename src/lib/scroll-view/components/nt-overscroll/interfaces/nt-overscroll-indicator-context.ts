import { IOverscrollEvent, ISize } from "../../../../common";
import { OverscrollIndicatorType } from "../../../../common/types/overscroll-indicator-type";
import { INtOverscrollIndicatorPublicApi } from "../../nt-overscroll-indicator/interfaces";

export interface INtOverscrollIndicatorContext {
    api: INtOverscrollIndicatorPublicApi;
    bounds: ISize;
    overscrollEvent: IOverscrollEvent | null;
    leftOffset: number;
    topOffset: number;
    rightOffset: number;
    bottomOffset: number;
    enabled: boolean;
    type: OverscrollIndicatorType;
}