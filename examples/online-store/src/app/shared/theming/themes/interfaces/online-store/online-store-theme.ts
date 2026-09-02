import { ButtonPresets } from "../../presets";
import { IButtonTheme } from "../components/button";
import { IOnlineStoreHeaderTheme } from "./online-store-header-theme";
import { IStoreItemsTheme } from "./online-store-posts/store-items-theme";
import { IOnlineStoreGroupsTheme } from "./online-store";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IOnlineStoreTheme {
    header: IOnlineStoreHeaderTheme;
    storeItems: IStoreItemsTheme;
    scrollToEndButton: ButtonPresets | IButtonTheme;
    groups: IOnlineStoreGroupsTheme;
}