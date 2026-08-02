import { DEFAULT_TRANSITION_EXPONENT } from "../../const/transitions";

/**
 * transitionExponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/transitions/transition-exponent.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const transitionExponent = (value: number, max: number, exp: number = DEFAULT_TRANSITION_EXPONENT) => {
    const k = max !== 0 ? (value / max) : 0, kQuad = Math.pow(k, exp);
    return value * kQuad;
}