import { IMessage } from "@widgets/messages/model/message";
import { MessageTypes } from "@shared/enums";
import { IVirtualListItem } from "centrifugal";

export const UNMAILED_SEPARATOR_INDEX = Number.MAX_SAFE_INTEGER - 2;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const generateUnmailedSeparator = (item: IVirtualListItem<IMessage>): IVirtualListItem<any> => {
    const id = UNMAILED_SEPARATOR_INDEX, type = MessageTypes.UNREAD_SEPARATOR;

    const dt = item?.dateTime, dateTime = dt !== undefined ? dt - 1 : Date.now();

    return {
        version: 0,
        id,
        dateTime,
        type,
    };
};
