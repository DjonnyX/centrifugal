import { KeyboardKeys } from "../../common";
import { PATTERN_DOT, PATTERN_REGEX_DOT } from "../../common/const/pattern";
import { TF_EMAIL_ALLOWED_CHARS, TF_NUMBER_ALLOWED_CHARS } from "../const/text-field-allowed-chars";
import { TextFieldTypes } from "../enums";
import { TextFieldType } from "../types";
import { replaceWithPattern } from "./replace-with-pattern";

/**
 * normalizeValueForTextField
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/utils/normalize-value-for-text-field.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const normalizeValueForTextField = (type: TextFieldType, value: string, ntValue: string | null, keyValue: string, pattern: string | null, isNgControl: boolean = false) => {
    let normalizedValue: string, normalizedNtValue: string;
    const regexp = !!pattern ? new RegExp(pattern) : null;
    switch (type) {
        case TextFieldTypes.NUMBER: {
            if (isNgControl) {
                const isDot = value.charAt(value.length - 1) === PATTERN_DOT,
                    isNtDot = ntValue?.charAt(ntValue.length - 1) === PATTERN_DOT,
                    v = value.replaceAll(TF_NUMBER_ALLOWED_CHARS, ''),
                    v1 = replaceWithPattern(regexp, v),
                    dotsMoreThanOne = Array.from(v1.matchAll(PATTERN_REGEX_DOT)).length > 1,
                    v2 = isDot && !dotsMoreThanOne && value.length === 1 ? `0${value}` : (isDot && dotsMoreThanOne ? v1.substring(0, v1.length - 1) : v1),
                    n = (isDot && keyValue !== KeyboardKeys.BACK_SPACE) ? ((isNtDot && v2.length > 1) ? `${v2.substring(0, v2.length - 2)}${v2.substring(v2.length - 1, v2.length)}` : dotsMoreThanOne ? `${v2}.0` : `${v2}0`) : ((isDot && keyValue === KeyboardKeys.BACK_SPACE) ? v2.substring(0, v2.length - 1) : (((isDot || isNtDot) && keyValue !== KeyboardKeys.BACK_SPACE && v2.length > 1) ? `${v2.substring(0, v2.length - 2)}${v2.substring(v2.length - 1, v2.length)}` : v2));
                normalizedNtValue = v2;
                normalizedValue = n;
            } else {
                const isDot = value.charAt(value.length - 1) === PATTERN_DOT,
                    v = value.replaceAll(TF_NUMBER_ALLOWED_CHARS, ''),
                    v1 = replaceWithPattern(regexp, v),
                    dotsMoreThanOne = Array.from(v1.matchAll(PATTERN_REGEX_DOT)).length > 1,
                    v2 = isDot && value.length === 1 ? `0${value}` : (isDot && dotsMoreThanOne ? v1.substring(0, v1.length - 1) : v1),
                    n = isDot ? `${v2}0` : v2;
                normalizedNtValue = v2;
                normalizedValue = n;
            }
            break;
        }
        case TextFieldTypes.EMAIL: {
            normalizedValue = value.replaceAll(TF_EMAIL_ALLOWED_CHARS, '');
            normalizedValue = replaceWithPattern(regexp, normalizedValue);
            normalizedNtValue = normalizedValue;
            break;
        }
        case TextFieldTypes.TEL: {
            normalizedValue = replaceWithPattern(regexp, value);
            normalizedNtValue = normalizedValue;
            break;
        }
        case TextFieldTypes.TEXT:
        case TextFieldTypes.PASSWORD:
        default: {
            normalizedValue = replaceWithPattern(regexp, value);
            normalizedNtValue = normalizedValue;
        }
    }
    return { normalizedValue: normalizedValue ?? '', normalizedNtValue };
}