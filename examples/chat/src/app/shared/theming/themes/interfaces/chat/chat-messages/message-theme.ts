import { IMessageContainerTheme } from "./message-container-theme";
import { IMessageContentTheme } from "./message-content-theme";
import { IMessageControlsTheme } from "./message-controls-theme";
import { IMessageStylesTheme } from "./message-styles-theme";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IMessageTheme {
    container: IMessageContainerTheme;
    content: IMessageContentTheme;
    controls: IMessageControlsTheme;
    styles: IMessageStylesTheme;
}