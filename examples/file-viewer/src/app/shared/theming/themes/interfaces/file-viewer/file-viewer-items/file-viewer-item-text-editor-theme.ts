import { Color } from "@shared/types";
import { IFileViewerItemTextEditorLinkStyles } from "./file-viewer-item-text-editor-link-styles";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IFileViewerItemTextEditorTheme {
    link: IFileViewerItemTextEditorLinkStyles;
    comment: {
        color: Color;
        background: Color;
    };
}