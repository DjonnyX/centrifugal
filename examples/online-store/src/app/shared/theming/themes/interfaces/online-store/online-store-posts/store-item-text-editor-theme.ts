import { Color } from "@shared/types";
import { IStoreItemTextEditorLinkStyles } from "./store-item-text-editor-link-styles";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IStoreItemTextEditorTheme {
    link: IStoreItemTextEditorLinkStyles;
    comment: {
        color: Color;
        background: Color;
    };
}