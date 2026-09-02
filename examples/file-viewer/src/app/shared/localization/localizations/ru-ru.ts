import { ILocalization } from "./interfaces/localization";
import { objectAsReadonly } from "../../utils/object";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
const localization: ILocalization = {
    fileViewer: {
        header: {
            search: {
                placeholder: 'Поиск',
            }
        },
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
