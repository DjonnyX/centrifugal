import { ButtonPresets } from "../../presets";
import { IButtonTheme } from "../components/button";
import { IAppHeaderTheme } from "./app-header-theme";
import { IMainTheme } from "./main";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IAppTheme {
    header: IAppHeaderTheme;
    scrollToEndButton: ButtonPresets | IButtonTheme;
    main: IMainTheme;
}