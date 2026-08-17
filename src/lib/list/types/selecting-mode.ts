import { SelectingModes } from "../enums/selecting-modes";

/**
 * Modes for selecting list items.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/selecting-mode.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type SelectingMode = SelectingModes | 'none' | 'select' | 'multi-select';
