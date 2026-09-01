import { SheetPositions } from "../enums";

/**
 * Axis of the arrangement of the sheet.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/types/sheet-position.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type SheetPosition = SheetPositions | 'left' | 'top' | 'right' | 'bottom';
