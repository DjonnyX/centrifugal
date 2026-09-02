import { ILocalization } from "./interfaces/localization";
import { objectAsReadonly } from "../../utils/object";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
const localization: ILocalization = {
    chat: {
        header: {
            search: {
                placeholder: 'Поиск',
            }
        },
        messages: {
            unmailedSeparator: 'Непрочитанные сообщения',
            message: {
                dialog: {
                    delete: {
                        title: 'Внимание',
                        message: 'Вы уверены, что хотите удалить сообщение?',
                        deleteAll: 'Удалить у всех',
                        cancel: 'отменить',
                        delete: 'удалить',
                    },
                },
                contextMenu: {
                    menu: {
                        edit: 'редактировать',
                        cancel: 'отменить',
                        quote: 'цитировать',
                        delete: 'удалить',
                    },
                },
            }
        }
    },
    common: {
        date: {
            yesterday: 'вчера',
            today: 'сегодня',
            tomorrow: 'завтра',
        },
    },
};

export const ruRU = objectAsReadonly(localization);
