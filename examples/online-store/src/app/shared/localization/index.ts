import { ILocalization } from "./localizations/interfaces/localization";
import { Locales } from "./localizations";
import { LocaleSensitiveDirective } from "./locale-sensitive.directive";
import { LocalizationService } from "./localization.service";
import { TextDirections } from "./localizations/enums";

export {
    Locales,
    LocaleSensitiveDirective,
    LocalizationService,
    TextDirections,
}

export type {
    ILocalization,
}