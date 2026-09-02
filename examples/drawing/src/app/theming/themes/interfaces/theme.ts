import { IAppTheme } from "./app/app-theme";
import { PresetThemes } from "../types/presets-themes";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface ITheme {
    app: IAppTheme;
    presets: PresetThemes;
}