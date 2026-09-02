import { Color } from "@shared/types";
import { IReaderTextEditorLinkStyles } from "./reader-text-editor-link-styles";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IReaderTextEditorTheme {
    link: IReaderTextEditorLinkStyles;
    comment: {
        color: Color;
        background: Color;
    };
}