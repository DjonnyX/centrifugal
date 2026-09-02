import { IVirtualListItem } from 'centrifugal';
import { MessageTypes } from "@shared/enums";
import { COLLECTION_PARAMS, textWithImage } from "@mock/const/collection";
import { IStoreItem } from "@widgets/online-store";

let timeOffset = 0;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const generateMessage = (): IVirtualListItem<IStoreItem> => {
    timeOffset++;
    const version = 0, id = COLLECTION_PARAMS.index + 1,
        isBanner = Math.random() > .95,
        type = isBanner ? MessageTypes.BANNER : MessageTypes.ITEM;
    COLLECTION_PARAMS.index++;

    const dateTime = COLLECTION_PARAMS.maxDate + timeOffset * 2000000;
    return {
        id,
        version,
        dateTime,
        price: Math.round(Math.random() * 10),
        type,
        isBanner,
        text: isBanner ? `${id} banner` : textWithImage(id),
    };
}
