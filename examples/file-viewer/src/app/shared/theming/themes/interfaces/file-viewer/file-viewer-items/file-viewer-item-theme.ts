import { IFileViewerItemContentTheme } from "./file-viewer-item-content-theme";
import { IFileViewerItemStylesTheme } from "./file-viewer-item-styles-theme";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IFileViewerItemTheme {
    content: IFileViewerItemContentTheme;
    styles: IFileViewerItemStylesTheme;
}