import { IGalleryContainerTheme } from "./gallery-container-theme";
import { IGalleryContentTheme } from "./gallery-content-theme";
import { IGalleryStylesTheme } from "./gallery-styles-theme";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IPageTheme {
    container: IGalleryContainerTheme;
    content: IGalleryContentTheme;
    styles: IGalleryStylesTheme;
}