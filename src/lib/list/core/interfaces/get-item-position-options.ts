import { IItem } from "./item";
import { IRecalculateMetricsOptions } from "./recalculate-metrics-options";

/**
 * IGetItemPositionOptions
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/core/interfaces/get-item-position-options.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IGetItemPositionOptions<I extends IItem, C extends Array<I>>
    extends Omit<IRecalculateMetricsOptions<I, C>, 'previousTotalSize' | 'crudDetected' | 'deletedItemsMap'> { }
