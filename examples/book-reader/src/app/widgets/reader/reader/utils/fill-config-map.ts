import { IBookPageData } from "@shared/models/pages";
import { IVirtualListItemConfigMap } from 'centrifugal';
import { IProxyCollectionItem } from "./proxy-collection";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const fillConfigMap = (config: IVirtualListItemConfigMap, collection: Array<IProxyCollectionItem<IBookPageData>>): IVirtualListItemConfigMap => {
    if (!Array.isArray(collection)) {
        return { ...config };
    }

    for (let i = 0, l = collection.length; i < l; i++) {
        const item = collection[i], { id } = item.data;
        config[id] = {
            sticky: 0,
            selectable: false,
            collapsable: false,
        }
    }

    return config;
}