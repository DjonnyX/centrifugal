import { Directions } from "../enums";
import { Direction } from "../types";

const HORIZONTAL_ALIASES = [Directions.HORIZONTAL, 'horizontal'],
    VERTICAL_ALIASES = [Directions.VERTICAL, 'vertical'],
    BOTH_ALIASES = [Directions.BOTH, 'both'];

/**
 * Determines the axis membership of a virtual list
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/utils/is-direction.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const isDirection = (src: Direction, expected: Direction): boolean => {
    if (BOTH_ALIASES.includes(expected)) {
        return BOTH_ALIASES.includes(src);
    }
    if (HORIZONTAL_ALIASES.includes(expected)) {
        return HORIZONTAL_ALIASES.includes(src);
    }
    return VERTICAL_ALIASES.includes(src);
}