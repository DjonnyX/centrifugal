import { IVirtualListItem } from 'centrifugal';
import { MessageTypes } from "@shared/enums";
import { COLLECTION_PARAMS, testFormattedTable, testFormattedText, testLinksText } from "@mock/const/collection";
import { IMessage } from "@widgets/reader";
import { generateText } from "./text";

let timeOffset = 0;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const generateMessage = (): IVirtualListItem<IMessage> => {
    timeOffset++;
    const version = 0, id = COLLECTION_PARAMS.index + 1,
        type = MessageTypes.MESSAGE,
        incomType = Math.random() > .5 ? 'in' : 'out',
        hasImage = Boolean(Math.round(Math.random() * .75));
    COLLECTION_PARAMS.index++;

    const dateTime = COLLECTION_PARAMS.maxDate + timeOffset * 2000000;
    return {
        id,
        version,
        dateTime,
        mailed: false,
        type,
        text: `${id}. ${id % 4 === 0 ? testLinksText() : id % 3 === 0 ? testFormattedText() : id % 5 === 0 ? testFormattedTable() : generateText()}`,
        image: hasImage ? 'https://centrifugal-book-reader.eugene-grebennikov.pro/media/logo.png' : undefined,
        incomType,
    };
}
