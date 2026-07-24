import { IRenderVirtualListItem } from "./render-item.model";

/**
 * Virtual list screen elements collection interface
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/models/render-collection.model.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IRenderVirtualListCollection extends Array<IRenderVirtualListItem> { };