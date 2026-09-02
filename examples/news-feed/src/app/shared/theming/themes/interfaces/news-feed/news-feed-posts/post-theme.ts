import { IPostContainerTheme } from "./post-container-theme";
import { IPostContentTheme } from "./post-content-theme";
import { IPostControlsTheme } from "./post-controls-theme";
import { IPostStylesTheme } from "./post-styles-theme";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IPostTheme {
    container: IPostContainerTheme;
    content: IPostContentTheme;
    controls: IPostControlsTheme;
    styles: IPostStylesTheme;
}