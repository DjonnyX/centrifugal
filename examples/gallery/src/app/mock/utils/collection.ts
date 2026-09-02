import { IVirtualListItem } from 'centrifugal';
import { GalleryTypes } from "@shared/enums";
import { COLLECTION_PARAMS } from "@mock/const/collection";
import { IGalleryImage } from "@widgets/gallery";

let timeOffset = 0;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const generateMessage = (): IVirtualListItem<IGalleryImage> => {
    timeOffset++;
    const version = 0, id = COLLECTION_PARAMS.index + 1,
        type = GalleryTypes.PHOTOS;
    COLLECTION_PARAMS.index++;

    return {
        id,
        version,
        type,
        text: ``,
        img: `https://centrifugal-image-gallery.eugene-grebennikov.pro/assets/thumbnails/img_%20${1 + Math.round(Math.random() * 25)}.jpg`,
        dateTime: COLLECTION_PARAMS.maxDate - COLLECTION_PARAMS.index * (500000 + Math.floor(500000 * Math.random())),
    };
}
