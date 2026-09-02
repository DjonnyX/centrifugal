import { IChatHeaderLocalization } from "./chat-header-localization";
import { IMessagesLocalization } from "./chat-messages-localization";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IChatLocalization {
    header: IChatHeaderLocalization;
    messages: IMessagesLocalization;
}