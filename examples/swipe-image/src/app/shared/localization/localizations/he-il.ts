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
                placeholder: 'לְחַפֵּשׂ',
            }
        },
        messages: {
            unmailedSeparator: 'הודעות שלא נקראו',
            message: {
                dialog: {
                    delete: {
                        title: 'תְשׁוּמַת לֵב',
                        message: `האם אתה בטוח שאתה רוצה למחוק את ההודעה?`,
                        deleteAll: 'מחיקה מכולם',
                        cancel: 'לְבַטֵל',
                        delete: 'לִמְחוֹק',
                    },
                },
                contextMenu: {
                    menu: {
                        edit: 'לַעֲרוֹך',
                        cancel: 'לְבַטֵל',
                        quote: 'לְצַטֵט',
                        delete: 'לִמְחוֹק',
                    },
                },
            }
        }
    },
    common: {
        date: {
            yesterday: 'אֶתמוֹל',
            today: 'הַיוֹם',
            tomorrow: 'מָחָר',
        },
    },
};

export const heIL = objectAsReadonly(localization);
