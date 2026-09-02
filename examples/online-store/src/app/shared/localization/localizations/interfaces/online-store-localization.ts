import { IOnlineStoreHeaderLocalization } from "./online-store-header-localization";
import { IPostsLocalization } from "./online-store-messages-localization";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IOnlineStoreLocalization {
    header: IOnlineStoreHeaderLocalization;
    messages: IPostsLocalization;
}