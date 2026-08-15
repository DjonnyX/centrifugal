import { Id, ISize, SnapToItemAlign } from "../../../common";
import { Alignment, ItemTransform } from "../../types";
import { IItem } from "./item";

/**
 * IRecalculateMetricsOptions
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/core/interfaces/recalculate-metrics-options.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IRecalculateMetricsOptions<I extends IItem, C extends Array<I>> {
    alignment: Alignment;
    bounds: ISize;
    collection: C;
    isVertical: boolean;
    itemSize: number;
    minItemSize: number;
    maxItemSize: number;
    bufferSize: number;
    maxBufferSize: number;
    dynamicSize: boolean;
    scrollSize: number;
    stickyEnabled: boolean;
    enabledBufferOptimization: boolean;
    fromItemId?: Id;
    previousTotalSize: number;
    crudDetected: boolean;
    deletedItemsMap: { [index: number]: ISize; };
    snapToItem: boolean;
    snapToItemAlign: SnapToItemAlign;
    inverted: boolean;
    itemTransform: ItemTransform | null;
}