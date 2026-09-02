import { IStoreItemData } from "@shared/models/message";
import { IVirtualListItemConfigMap } from 'centrifugal';
import { IProxyCollectionItem } from "./proxy-collection";
import { MessageTypes } from "@shared/enums";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const fillConfigMap = (config: IVirtualListItemConfigMap, collection: Array<IProxyCollectionItem<IStoreItemData>>): IVirtualListItemConfigMap => {
    if (!Array.isArray(collection)) {
        return { ...config };
    }

    for (let i = 0, l = collection.length; i < l; i++) {
        const item = collection[i], { id, type, isBanner } = item.data, isGroup = type === MessageTypes.GROUP;
        config[id] = {
            sticky: isGroup ? 1 : 0,
            fullSize: isBanner,
            selectable: !isGroup,
            collapsable: isGroup,
        }
    }

    return config;
}