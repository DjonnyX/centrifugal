import { Color } from "../../../../../types";
import { IMessageStateTheme } from "./message-state-theme";
import { IMessageTextEditorTheme } from "./message-text-editor-theme";

interface IMessageContentStateTheme {
    textEditor: IMessageTextEditorTheme;
    rippleColor: Color;
    searchSubstringColor: string;
    editingTextBackground: string;
    editingTextFocusedOutline: string;
    normal: IMessageStateTheme;
    selected: IMessageStateTheme;
    focused: IMessageStateTheme;
    focusedSelected: IMessageStateTheme;
    removal: IMessageStateTheme;
    removalSelected: IMessageStateTheme;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IMessageContentTheme {
    in: IMessageContentStateTheme;
    out: IMessageContentStateTheme;
}