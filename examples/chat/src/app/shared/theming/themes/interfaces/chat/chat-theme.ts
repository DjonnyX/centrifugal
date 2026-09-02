import { ButtonPresets } from "../../presets";
import { IButtonTheme } from "../components/button";
import { IChatHeaderTheme } from "./chat-header-theme";
import { IChatMessagesTheme } from "./chat-messages/messages-theme";
import { IChatsTheme } from "./chats";
import { IMessageCreatorTheme } from "./message-creator";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IChatTheme {
    header: IChatHeaderTheme;
    messageCreator: IMessageCreatorTheme;
    messages: IChatMessagesTheme;
    scrollToEndButton: ButtonPresets | IButtonTheme;
    chats: IChatsTheme;
}