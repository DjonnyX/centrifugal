import { ISize } from "./size";

/**
 * Rectangular area interface
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/interfaces/rect.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IRect extends ISize {
    /**
     * X coordinate.
     */
    x: number;
    /**
     * Y coordinate.
     */
    y: number;
}