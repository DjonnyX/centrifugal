import { ILocalization } from "./interfaces/localization";
import { objectAsReadonly } from "../../utils/object";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export const localization: ILocalization = {
    fileViewer: {
        header: {
            search: {
                placeholder: 'לְחַפֵּשׂ',
            }
        },
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
