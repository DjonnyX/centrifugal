import { IAppNavMenuStateTheme } from "./app-nav-menu-state-theme";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IGroupTheme {
    normal: IAppNavMenuStateTheme;
    selected: IAppNavMenuStateTheme;
    focused: IAppNavMenuStateTheme;
    focusedSelected: IAppNavMenuStateTheme;
}