import { GalleryTypes } from "@shared/enums";
import { IGalleryImageData } from "@shared/models/pages";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IGalleryImage extends IGalleryImageData {
    version: number;
    dateTime: number;
    type: GalleryTypes;
}
