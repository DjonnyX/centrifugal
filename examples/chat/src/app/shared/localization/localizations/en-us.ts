import { ILocalization } from "./interfaces/localization";
import { objectAsReadonly } from "../../utils/object";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const localization: ILocalization = {
    chat: {
        header: {
            search: {
                placeholder: 'Search',
            }
        },
        messages: {
            unmailedSeparator: 'Unread messages',
            message: {
                dialog: {
                    delete: {
                        title: 'Attention',
                        message: 'Are you sure you want to delete the message?',
                        deleteAll: 'Delete from everyone',
                        cancel: 'cancel',
                        delete: 'delete',
                    },
                },
                contextMenu: {
                    menu: {
                        edit: 'edit',
                        cancel: 'cancel',
                        quote: 'quote',
                        delete: 'delete',
                    },
                },
            }
        }
    },
    common: {
        date: {
            yesterday: 'yesterday',
            today: 'today',
            tomorrow: 'tomorrow',
        },
    },
};

export const enUS = objectAsReadonly(localization);
