import { IBannerTheme } from "./banner-theme";
import { IGroupTheme } from "./group-theme";
import { IStoreItemTheme } from "./store-item-theme";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IStoreItemsTheme {
    background: string;
    backgroundImage: string;
    storeItem: IStoreItemTheme;
    banner: IBannerTheme;
    group: IGroupTheme;
}