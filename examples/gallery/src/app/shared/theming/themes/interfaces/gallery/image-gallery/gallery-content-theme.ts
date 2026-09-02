import { IGalleryStateTheme } from "./gallery-state-theme";
import { IGalleryTextEditorTheme } from "./gallery-text-editor-theme";

interface IGalleryContentStateTheme {
    textEditor: IGalleryTextEditorTheme;
    searchSubstringColor: string;
    normal: IGalleryStateTheme;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IGalleryContentTheme extends IGalleryContentStateTheme { }