import { ILocalization } from "./interfaces/localization";
import { TextDirections } from "./enums";
import { enUS } from "./en-us";
import { heIL } from "./he-il";
import { ruRU } from "./ru-ru";

enum Locales {
    EN_US = 'en-US',
    HE_IL = 'he-IL',
    RU_RU = 'ru-RU',
}

const LocaleList: Array<string> = [
    Locales.EN_US,
    Locales.HE_IL,
    Locales.RU_RU,
];

const RTL: Array<string> = [Locales.HE_IL];

Object.freeze(RTL);

const getTextDirectionByLocale = (locale: Locales | string): TextDirections => {
    if (RTL.includes(locale)) {
        return TextDirections.RTL;
    }
    return TextDirections.LTR;
};

Object.freeze(LocaleList);

type Locale = Locales | string;

const Localizations: { [locale: Locale]: ILocalization } = {
    [Locales.EN_US]: enUS,
    [Locales.HE_IL]: heIL,
    [Locales.RU_RU]: ruRU,
};

export {
    Locales,
    LocaleList,
    Localizations,
    getTextDirectionByLocale,
}