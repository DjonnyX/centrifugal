import { Directions } from "../../common";

/**
 * Axis of the arrangement of virtual list elements.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/types/direction.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type Direction = Directions.HORIZONTAL | Directions.VERTICAL | 'horizontal' | 'vertical';
