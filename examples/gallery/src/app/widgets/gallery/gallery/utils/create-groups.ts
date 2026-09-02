import { IVirtualListItem } from "centrifugal";
import { GalleryTypes } from "@shared/enums";
import { ILocalization } from "@shared/localization";
import { IGalleryImage } from "@widgets/gallery";
import { IGetGalleryData } from "@widgets/gallery/model/gallery";
import { ProxyCollection } from "./proxy-collection";
import { IGalleryImageData } from "@shared/models/pages";

const sortByDateTime = (a: IVirtualListItem<IGalleryImage>, b: IVirtualListItem<IGalleryImage>) => {
    if (a.dateTime > b.dateTime) {
        return 1;
    }
    if (a.dateTime < b.dateTime) {
        return -1;
    }
    return a.type === GalleryTypes.GROUP && b.type !== GalleryTypes.GROUP ? -1 : 0;
}

export const createGroups = (list: IGetGalleryData, proxy: ProxyCollection<IGalleryImageData>,
    locale: string, localization: ILocalization,): IGetGalleryData => {
    const result: IGetGalleryData = {
        pages: [],
        version: list.version,
    };

    const items = list.pages.sort(sortByDateTime);
    let currentDate: Date | undefined;
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
            const dateItem: IVirtualListItem<IGalleryImage> = {
                version: 0,
                id: date.getTime(),
                dateTime: date.getTime(),
                img: `https://image-gallery-demo-x12.eugene-grebennikov.pro/assets/img_%20${1 + Math.round( Math.random() * 25)}.jpg`,
                text,
                type: GalleryTypes.GROUP,
            };
            result.pages.push(dateItem);
        }
        result.pages.push(item);
    }
    return result;
}