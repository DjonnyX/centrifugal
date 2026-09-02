import { IVirtualListCollection } from "centrifugal";
import { IAnswer } from "./answer";
import { IFileViewerItem } from "./store-item";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IGetPostsData {
    version: number;
    items: IVirtualListCollection<IFileViewerItem>;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IGetPostsAnswer extends IAnswer<IGetPostsData> { }
