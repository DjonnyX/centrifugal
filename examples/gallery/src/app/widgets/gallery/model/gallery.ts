import { IVirtualListCollection } from "centrifugal";
import { IAnswer } from "./answer";
import { IGalleryImage } from "./gallery-image";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IGetGalleryData {
    version: number;
    pages: IVirtualListCollection<IGalleryImage>;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IGetGalleryImagesAnswer extends IAnswer<IGetGalleryData> { }
