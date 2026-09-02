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
                placeholder: 'Search',
            }
        },
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
