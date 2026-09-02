import { IReaderStateTheme } from "./reader-state-theme";
import { IReaderTextEditorTheme } from "./reader-text-editor-theme";

interface IReaderContentStateTheme {
    textEditor: IReaderTextEditorTheme;
    searchSubstringColor: string;
    normal: IReaderStateTheme;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IReaderContentTheme extends IReaderContentStateTheme { }