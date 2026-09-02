import { IButtonTheme } from "../components/button";
import { INewsFeedSearchTheme } from "./news-feed-search";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface INewsFeedHeaderTheme {
    background: string;
    color: string;
    fontSize: string;
    menuButton: IButtonTheme;
    search: INewsFeedSearchTheme;
}