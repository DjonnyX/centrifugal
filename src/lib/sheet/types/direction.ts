import { Directions } from "../../common";

/**
 * Axis of the arrangement of a sheet.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/types/direction.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type Direction = Directions.HORIZONTAL | Directions.VERTICAL | 'horizontal' | 'vertical';
