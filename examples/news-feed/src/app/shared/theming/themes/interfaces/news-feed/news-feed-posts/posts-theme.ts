import { IGroupTheme } from "./group-theme";
import { IPostTheme } from "./post-theme";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface INewsFeedMessagesTheme {
    background: string;
    backgroundImage: string;
    group: IGroupTheme;
    post: IPostTheme;
}