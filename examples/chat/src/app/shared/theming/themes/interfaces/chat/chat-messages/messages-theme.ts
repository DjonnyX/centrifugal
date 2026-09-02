import { IGroupTheme } from "./group-theme";
import { IMessageTheme } from "./message-theme";
import { IMessageQuoteStatesTheme } from "./quote-theme";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IChatMessagesTheme {
    background: string;
    backgroundImage: string;
    group: IGroupTheme;
    unmailedSeparator: IGroupTheme;
    message: IMessageTheme;
    quote: IMessageQuoteStatesTheme;
}