import { IGroupTheme } from "./group-theme";
import { IFileViewerItemTheme } from "./file-viewer-item-theme";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IFileViewerItemsTheme {
    background: string;
    backgroundImage: string;
    item: IFileViewerItemTheme;
    group: IGroupTheme;
}