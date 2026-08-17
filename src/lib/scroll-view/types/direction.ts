import { Directions } from "../enums/directions";

/**
 * Axis of the arrangement of virtual list elements.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/direction.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type Direction = Directions | 'horizontal' | 'vertical' | 'both';
