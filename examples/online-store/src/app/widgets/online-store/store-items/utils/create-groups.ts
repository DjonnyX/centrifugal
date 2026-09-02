import { IVirtualListItem } from 'centrifugal';
import { MessageTypes } from "@shared/enums";
import { ILocalization } from "@shared/localization";
import { IStoreItem } from "@widgets/online-store";
import { IGetItemsData } from "@widgets/online-store/model/items";
import { ProxyCollection } from "./proxy-collection";
import { IStoreItemData } from "@shared/models/message";

const sortByDateTime = (a: IVirtualListItem<IStoreItem>, b: IVirtualListItem<IStoreItem>) => {
    if (a.dateTime > b.dateTime) {
        return 1;
    }
    if (a.dateTime < b.dateTime) {
        return -1;
    }
    return a.type === MessageTypes.GROUP && b.type !== MessageTypes.GROUP ? -1 : 0;
}

export const createGroups = (list: IGetItemsData, proxy: ProxyCollection<IStoreItemData>,
    locale: string, localization: ILocalization,): IGetItemsData => {
    const result: IGetItemsData = {
        items: [],
        version: list.version,
    };

    const items = list.items.sort(sortByDateTime), currentUnmailedSeparator = proxy.unmailed;
    let currentDate: Date | undefined;
    let unmailed: IVirtualListItem<IStoreItem> | undefined;
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
            const dateItem: IVirtualListItem<IStoreItem> = {
                version: 0,
                mailed: true,
                id: date.getTime(),
                dateTime: date.getTime(),
                price: Math.round(Math.random() * 10),
                text,
                type: MessageTypes.GROUP,
            };
            result.items.push(dateItem);
        }
        result.items.push(item);
    }
    return result;
}