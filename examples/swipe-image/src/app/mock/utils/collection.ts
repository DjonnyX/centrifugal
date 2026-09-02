import { IVirtualListItem } from 'centrifugal';
import { COLLECTION_PARAMS } from "@mock/const/collection";
import { ISwipeImage } from "@widgets/swipe-image";

let timeOffset = 0;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const generateMessage = (): IVirtualListItem<ISwipeImage> => {
    timeOffset++;
    const version = 0, id = COLLECTION_PARAMS.index + 1;
    COLLECTION_PARAMS.index++;

    const dateTime = COLLECTION_PARAMS.maxDate + timeOffset * 2000000;
    return {
        id,
        version,
        dateTime,
        img: `https://centrifugal-swipe-image.eugene-grebennikov.pro/assets/img_%20${1 + Math.round(Math.random() * 25)}.jpg`,
    };
}
