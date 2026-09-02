import { IReaderContainerTheme } from "./reader-container-theme";
import { IReaderContentTheme } from "./reader-content-theme";
import { IReaderStylesTheme } from "./reader-styles-theme";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IPageTheme {
    container: IReaderContainerTheme;
    content: IReaderContentTheme;
    styles: IReaderStylesTheme;
}