import { IVirtualListItem, IVirtualListItemConfig } from "centrifugal";
import { MessageTypes } from "@shared/enums";

export const TYPING_INDICATOR_INDEX = Number.MAX_SAFE_INTEGER - 1;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const generateTypingIndicator = (): { item: IVirtualListItem<any>, config: IVirtualListItemConfig } => {
    const id = TYPING_INDICATOR_INDEX, type = MessageTypes.TYPING_INDICATOR;

    const dateTime = TYPING_INDICATOR_INDEX;

    return {
        item: {
            id,
            dateTime,
            type,
        },
        config: {
            sticky: 0,
            collapsable: false,
            selectable: false,
        },
    };
};
