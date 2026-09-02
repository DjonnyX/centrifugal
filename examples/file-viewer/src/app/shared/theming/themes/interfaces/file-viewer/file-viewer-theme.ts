import { ButtonPresets } from "../../presets";
import { IButtonTheme } from "../components/button";
import { IFileViewerHeaderTheme } from "./file-viewer-header-theme";
import { IFileViewerItemsTheme } from "./file-viewer-items/file-viewer-items-theme";
import { IFileViewerGroupsTheme } from "./file-viewer";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IFileViewerTheme {
    header: IFileViewerHeaderTheme;
    items: IFileViewerItemsTheme;
    scrollToEndButton: ButtonPresets | IButtonTheme;
    groups: IFileViewerGroupsTheme;
}