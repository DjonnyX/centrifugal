import { Color, GradientColor } from "../../../../../types";
import { IStoreItemStateTheme } from "./store-item-state-theme";
import { IStoreItemTextEditorTheme } from "./store-item-text-editor-theme";

interface IStoreItemContentStateTheme extends IStoreItemStateTheme {
    textEditor: IStoreItemTextEditorTheme;
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
export interface IStoreItemContentTheme extends IStoreItemContentStateTheme { }