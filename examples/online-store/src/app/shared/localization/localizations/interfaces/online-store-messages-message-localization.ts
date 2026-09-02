import { IOnlineStoreMessagesMessageContextMenuMenuLocalization } from "./online-store-messages-message-context-menu-menu-localization";
import { IOnlineStoreMessagesMessageDeleteDialogLocalizataion } from "./online-store-messages-message-delete-dialog-localization"

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IOnlineStoreMessagesMessageLocalizataion {
    dialog: {
        delete: IOnlineStoreMessagesMessageDeleteDialogLocalizataion;
    },
    contextMenu: {
        menu: IOnlineStoreMessagesMessageContextMenuMenuLocalization;
    },
}