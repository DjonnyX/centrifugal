import { IChatMessagesMessageContextMenuMenuLocalization } from "./chat-messages-message-context-menu-menu-localization";
import { IChatMessagesMessageDeleteDialogLocalizataion } from "./chat-messages-message-delete-dialog-localization"

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IChatMessagesMessageLocalizataion {
    dialog: {
        delete: IChatMessagesMessageDeleteDialogLocalizataion;
    },
    contextMenu: {
        menu: IChatMessagesMessageContextMenuMenuLocalization;
    },
}