import { PERCENTAGE_VALUE_PATTERN } from "../const/calc";

/**
 * isPercentageValue
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/is-persentage-value.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const isPercentageValue = (value: number | `${number}%` | string) => {
    if (value === undefined || typeof value === 'number') {
        return false;
    }
    return PERCENTAGE_VALUE_PATTERN.test(value);
};