import { Color } from "../../../../../types";
import { IPostStateTheme } from "./post-state-theme";
import { IPostTextEditorTheme } from "./post-text-editor-theme";

interface IPostContentStateTheme {
    textEditor: IPostTextEditorTheme;
    rippleColor: Color;
    searchSubstringColor: string;
    editingTextBackground: string;
    editingTextFocusedOutline: string;
    normal: IPostStateTheme;
    selected: IPostStateTheme;
    focused: IPostStateTheme;
    focusedSelected: IPostStateTheme;
    removal: IPostStateTheme;
    removalSelected: IPostStateTheme;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IPostContentTheme extends IPostContentStateTheme { }