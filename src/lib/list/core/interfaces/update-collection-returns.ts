import { IRenderVirtualListCollection } from "../../models/render-collection.model";

/**
 * IUpdateCollectionReturns
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/core/interfaces/update-collection-returns.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IUpdateCollectionReturns {
    displayItems: IRenderVirtualListCollection;
    totalSize: number;
    leftLayoutOffset: number;
    delta: number;
    crudDetected: boolean;
}