import { ButtonPresets } from "../../presets";
import { IButtonTheme } from "../components/button";
import { INewsFeedHeaderTheme } from "./neews-feed-header-theme";
import { INewsFeedMessagesTheme } from "./news-feed-posts/posts-theme";
import { INewsFeedGroupsTheme } from "./news-feed";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface INewsFeedTheme {
    header: INewsFeedHeaderTheme;
    posts: INewsFeedMessagesTheme;
    scrollToEndButton: ButtonPresets | IButtonTheme;
    groups: INewsFeedGroupsTheme;
}