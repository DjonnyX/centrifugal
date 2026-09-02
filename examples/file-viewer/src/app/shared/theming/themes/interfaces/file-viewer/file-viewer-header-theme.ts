import { IButtonTheme } from "../components/button";
import { IFileViewerSearchTheme } from "./file-viewer-search";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IFileViewerHeaderTheme {
    background: string;
    color: string;
    fontSize: string;
    menuButton: IButtonTheme;
    search: IFileViewerSearchTheme;
}