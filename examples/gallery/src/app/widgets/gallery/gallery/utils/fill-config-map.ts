import { IGalleryImageData } from "@shared/models/pages";
import { IVirtualListItemConfigMap } from "centrifugal";
import { IProxyCollectionItem } from "./proxy-collection";
import { GalleryTypes } from "@shared/enums";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const fillConfigMap = (config: IVirtualListItemConfigMap, collection: Array<IProxyCollectionItem<IGalleryImageData>>): IVirtualListItemConfigMap => {
    if (!Array.isArray(collection)) {
        return { ...config };
    }

    for (let i = 0, l = collection.length; i < l; i++) {
        const item = collection[i], { id, type } = item.data, isGroup = type === GalleryTypes.GROUP;
        config[id] = {
            sticky: isGroup ? 1 : 0,
            selectable: !isGroup,
            collapsable: isGroup,
        }
    }

    return config;
}