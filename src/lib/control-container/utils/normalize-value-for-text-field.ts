import { PATTERN_DOT } from "../const/pattern";
import { TF_EMAIL_ALLOWED_CHARS, TF_NUMBER_ALLOWED_CHARS } from "../const/text-field-allowed-chars";
import { TextFieldTypes } from "../enums";
import { TextFieldType } from "../types";

export const normalizeValueForTextField = (type: TextFieldType, value: string) => {
    let normalizedValue: string, ntValue: string;
    switch (type) {
        case TextFieldTypes.NUMBER: {
            const isDot = value.charAt(value.length - 1).match(PATTERN_DOT),
                v = value.replaceAll(TF_NUMBER_ALLOWED_CHARS, ''),
                dotsLargeThenOne = Array.from(v.matchAll(PATTERN_DOT)).length > 1,
                v1 = isDot && dotsLargeThenOne ? v.slice(0, v.length - 1) : v,
                n = isDot && !dotsLargeThenOne ? `${v1}0` : v1;
            ntValue = v1;
            normalizedValue = n;
            break;
        }
        case TextFieldTypes.EMAIL: {
            normalizedValue = value.replaceAll(TF_EMAIL_ALLOWED_CHARS, '');
            ntValue = normalizedValue;
            break;
        }
        case TextFieldTypes.TEL: {
            normalizedValue = value.replaceAll(TF_EMAIL_ALLOWED_CHARS, '');
            ntValue = normalizedValue;
            break;
        }
        case TextFieldTypes.TEXT:
        case TextFieldTypes.PASSWORD:
        default: {
            ntValue = value;
            normalizedValue = value;
        }
    }
    return { normalizedValue: normalizedValue ?? '', ntValue };
}