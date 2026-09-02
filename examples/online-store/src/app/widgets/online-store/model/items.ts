import { IVirtualListCollection } from "centrifugal";
import { IAnswer } from "./answer";
import { IStoreItem } from "./store-item";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IGetItemsData {
    version: number;
    items: IVirtualListCollection<IStoreItem>;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IGetItemsAnswer extends IAnswer<IGetItemsData> { }
