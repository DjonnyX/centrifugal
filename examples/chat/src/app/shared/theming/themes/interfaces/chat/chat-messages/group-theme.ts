import { IGroupStateTheme } from "./group-state-theme";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IGroupTheme {
    normal: IGroupStateTheme;
    selected: IGroupStateTheme;
    focused: IGroupStateTheme;
    focusedSelected: IGroupStateTheme;
}