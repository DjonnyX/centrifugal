import { Directions } from "../../common";
import { Direction } from "../types";

const HORIZONTAL_ALIASES: Array<Direction> = [Directions.HORIZONTAL, 'horizontal'],
    VERTICAL_ALIASES: Array<Direction> = [Directions.VERTICAL, 'vertical'];

/**
 * Determines the axis
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/is-direction.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const isDirection = (src: Direction, expected: Direction): boolean => {
    if (HORIZONTAL_ALIASES.includes(expected)) {
        return HORIZONTAL_ALIASES.includes(src);
    }
    return VERTICAL_ALIASES.includes(src);
}