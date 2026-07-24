import { FocusAlignment } from "./focus-alignment";

/**
 * FocusItemParams
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/focus-item-params.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type FocusItemParams = {
    element: HTMLElement;
    position: number;
    align?: FocusAlignment;
    behavior?: ScrollBehavior
}
