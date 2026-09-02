import { MessageTypes } from "@shared/enums";
import { COLLECTION_PARAMS, testFormattedTable, testFormattedText, testLinksText } from "@mock/const/collection";
import { IMessage } from "@widgets/messages";
import { generateText } from "./text";
import { IVirtualListItem } from "centrifugal";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const generateWriteIndicator = (): IVirtualListItem<IMessage> => {
    const version = 0, i = COLLECTION_PARAMS.index + 1, id = i + 1, type = MessageTypes.TYPING_INDICATOR;

    COLLECTION_PARAMS.index++;

    const dateTime = COLLECTION_PARAMS.maxDate + COLLECTION_PARAMS.index * 60000;

    return { id, version, mailed: true, text: '', dateTime, type };
}

let timeOffset = 0;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const generateMessage = (): IVirtualListItem<IMessage> => {
    timeOffset++;
    const version = 0, id = COLLECTION_PARAMS.index + 1,
        type = Math.random() > .35 ? MessageTypes.MESSAGE : MessageTypes.QUOTE,
        incomType = Math.random() > .5 ? 'in' : 'out',
        hasImage = Boolean(Math.round(Math.random() * .75));
    COLLECTION_PARAMS.index++;

    const dateTime = COLLECTION_PARAMS.maxDate + timeOffset * 2000000;
    return {
        id,
        quoteId: type === MessageTypes.QUOTE ? COLLECTION_PARAMS.index + 10 : undefined,
        version,
        dateTime,
        mailed: false,
        type,
        text: `${id}. ${id % 4 === 0 ? testLinksText() : id % 3 === 0 ? testFormattedText() : id % 5 === 0 ? testFormattedTable() : generateText()}`,
        image: hasImage ? `https://centrifugal-chat.eugene-grebennikov.pro/assets/thumbnails/img_%20${1 + Math.round( Math.random() * 25)}.jpg` : undefined,
        incomType,
    };
}
