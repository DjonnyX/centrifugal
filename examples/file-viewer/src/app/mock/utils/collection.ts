import { IVirtualListItem } from 'centrifugal';
import { MessageTypes } from "@shared/enums";
import { COLLECTION_PARAMS, textWithImage } from "@mock/const/collection";
import { IFileViewerItem } from "@widgets/file-viewer";

let timeOffset = 0;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const generateMessage = (): IVirtualListItem<IFileViewerItem> => {
    timeOffset++;
    const version = 0, id = COLLECTION_PARAMS.index + 1,
        isBanner = Math.random() > .95,
        type = isBanner ? MessageTypes.GROUP : MessageTypes.ITEM;
    COLLECTION_PARAMS.index++;

    const dateTime = COLLECTION_PARAMS.maxDate + timeOffset * 2000000;
    return {
        id,
        version,
        dateTime,
        type,
        isBanner,
        text: isBanner ? `${id} banner` : `${id}. ${textWithImage(id)}`,
    };
}
