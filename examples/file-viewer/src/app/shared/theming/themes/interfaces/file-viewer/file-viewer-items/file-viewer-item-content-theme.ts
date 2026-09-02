import { Color, GradientColor } from "../../../../../types";
import { IFileViewerItemStateTheme } from "./file-viewer-item-state-theme";
import { IFileViewerItemTextEditorTheme } from "./file-viewer-item-text-editor-theme";

interface IFileViewerItemContentStateTheme extends IFileViewerItemStateTheme {
    textEditor: IFileViewerItemTextEditorTheme;
    background: GradientColor;
    rippleColor: Color;
    searchSubstringColor: string;
    editingTextBackground: string;
    editingTextFocusedOutline: string;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IFileViewerItemContentTheme extends IFileViewerItemContentStateTheme { }