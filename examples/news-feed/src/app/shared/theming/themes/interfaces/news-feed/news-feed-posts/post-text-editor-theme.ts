import { Color } from "@shared/types";
import { IPostTextEditorLinkStyles } from "./post-text-editor-link-styles";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IPostTextEditorTheme {
    link: IPostTextEditorLinkStyles;
    comment: {
        color: Color;
        background: Color;
    };
}