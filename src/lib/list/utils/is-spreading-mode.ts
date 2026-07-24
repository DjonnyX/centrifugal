import { SpreadingModes } from "../enums";
import { SpreadingMode } from "../types";

const NORMAL_ALIASES = [SpreadingModes.NORMAL, 'normal'],
    INFINITY_ALIASES = [SpreadingModes.INFINITY, 'infinity'];

/**
 * Determines the display mode of list items.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/utils/is-select-mode.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const isSpreadingMode = (src: SpreadingMode, expected: SpreadingMode): boolean => {
    if (INFINITY_ALIASES.includes(expected)) {
        return INFINITY_ALIASES.includes(src);
    }
    return NORMAL_ALIASES.includes(src);
}
