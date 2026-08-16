import { ISize } from "../../common";

/**
 * Interface ISheetPrecalculatedBreakpoint
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/interfaces/sheet-precalculated-breakpoint.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface ISheetPrecalculatedBreakpoint {
    id: string;
    position: number;
    config: {
        isFirst: boolean;
        isLast: boolean;
        inverted: boolean;
        isVertical: boolean;
    }
    bounds: ISize;
    measures: {
        x: number;
        y: number;
        maxScrollSize: number;
    }
}