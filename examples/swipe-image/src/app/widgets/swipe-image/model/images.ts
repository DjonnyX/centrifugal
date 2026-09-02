import { IVirtualListCollection } from "centrifugal";
import { IAnswer } from "./answer";
import { ISwipeImage } from "./swipe-image";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IGetSwipeImageData {
    version: number;
    pages: IVirtualListCollection<ISwipeImage>;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IGetImagesAnswer extends IAnswer<IGetSwipeImageData> { }
