import { IItemTransformation } from "../interfaces";
import { IRenderVirtualListItemConfig, IRenderVirtualListItemMeasures } from "../models";

/**
 * ItemTransform
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/item-transform.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type ItemTransform = (index: number, measures: IRenderVirtualListItemMeasures, config: IRenderVirtualListItemConfig) =>
    IItemTransformation;
