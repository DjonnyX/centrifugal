import { Id } from "../../common";
import { IVirtualListItem } from "./item.model";
import { IRenderVirtualListItemConfig } from "./render-item-config.model";
import { IRenderVirtualListItemMeasures } from "./render-item-measures.model";

/**
 * List screen element model
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/models/render-item.model.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IRenderVirtualListItem<E = any> {
    /**
     * Element index.
     */
    index: number;
    /**
     * Unique identifier of the element.
     */
    id: Id;
    /**
     * Element metrics.
     */
    measures: IRenderVirtualListItemMeasures;
    /**
     * Element data.
     */
    data: IVirtualListItem<E>;
    /**
     * Previous element data.
     */
    previouseData: IVirtualListItem<E>;
    /**
     * Next element data.
     */
    nextData: IVirtualListItem<E>;
    /**
     * Object with configuration parameters for IRenderVirtualListItem.
     */
    config: IRenderVirtualListItemConfig;
};
