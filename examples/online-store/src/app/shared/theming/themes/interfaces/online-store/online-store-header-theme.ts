import { IButtonTheme } from "../components/button";
import { IOnlineStoreSearchTheme } from "./online-store-search";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IOnlineStoreHeaderTheme {
    background: string;
    color: string;
    fontSize: string;
    menuButton: IButtonTheme;
    search: IOnlineStoreSearchTheme;
}