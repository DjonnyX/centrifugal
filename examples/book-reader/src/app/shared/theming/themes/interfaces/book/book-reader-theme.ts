import { ButtonPresets } from "../../presets";
import { IButtonTheme } from "../components/button";
import { IReaderHeaderTheme } from "./reader-header-theme";
import { IReaderTheme } from "./reader/reader-theme";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IBookReaderTheme {
    header: IReaderHeaderTheme;
    messages: IReaderTheme;
    scrollToEndButton: ButtonPresets | IButtonTheme;
}