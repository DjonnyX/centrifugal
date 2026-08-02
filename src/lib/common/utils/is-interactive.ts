import { DEFAULT_INPUT_ELEMETNS } from "../directives/nt-virtual-click/const";

/**
 * isInteractive
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/is-interactive.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const isInteractive = (tag: string): boolean => {
    return DEFAULT_INPUT_ELEMETNS.indexOf(tag) > -1;
}