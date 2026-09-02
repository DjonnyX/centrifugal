import { MessageTypes } from "@shared/enums";
import { ILocalization } from "@shared/localization";
import { IMessage } from "@widgets/messages";
import { IGetMessagesData } from "@widgets/messages/model/messages";
import { generateUnmailedSeparator } from "./generate-unmailed-separator";
import { ProxyCollection } from "./proxy-collection";
import { IMessageItemData } from "@shared/models/message";
import { IVirtualListItem } from "centrifugal";

const sortByDateTime = (a: IVirtualListItem<IMessage>, b: IVirtualListItem<IMessage>) => {
    if (a.dateTime > b.dateTime) {
        return 1;
    }
    if (a.dateTime < b.dateTime) {
        return -1;
    }
    return a.type === MessageTypes.GROUP && b.type !== MessageTypes.GROUP ? -1 : 0;
}

export const createGroups = (list: IGetMessagesData, proxy: ProxyCollection<IMessageItemData>,
    locale: string, localization: ILocalization,): IGetMessagesData => {
    const result: IGetMessagesData = {
        items: [],
        version: list.version,
    };

    const items = list.items.sort(sortByDateTime), currentUnmailedSeparator = proxy.unmailed;
    let currentDate: Date | undefined;
    let unmailed: IVirtualListItem<IMessage> | undefined;
    for (let i = 0, l = items.length; i < l; i++) {
        const item = { ...items[i] };

        if (!item.dateTime) {
            continue;
        }

        const dateTime = item.dateTime, d = new Date(dateTime), date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        if (!currentDate || currentDate != date) {
            currentDate = date;
            const dayFormat = Intl.DateTimeFormat(locale).format(date), istoday = dayFormat === Intl.DateTimeFormat(locale).format(new Date());
            let text = '';
            if (istoday) {
                text = localization.common.date.today;
            } else {
                text = dayFormat;
            }
            const dateItem: IVirtualListItem<IMessage> = {
                version: 0,
                mailed: true,
                id: date.getTime(),
                dateTime: date.getTime(),
                text,
                type: MessageTypes.GROUP,
            };
            result.items.push(dateItem);
        }
        if (!item.mailed && !unmailed) {
            if (!currentUnmailedSeparator || (currentUnmailedSeparator?.data?.dateTime !== (item.dateTime - 1))) {
                if (currentUnmailedSeparator) {
                    proxy.delete(currentUnmailedSeparator.id);
                }
                const unreadItem: IVirtualListItem<IMessage> = generateUnmailedSeparator(item);
                result.items.push(unreadItem);
            }
            unmailed = item;
        }
        result.items.push(item);
    }
    return result;
}