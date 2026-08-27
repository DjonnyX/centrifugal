import { ISize } from "../../common";

/**
 * IDrawerBreakpoint
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/drawer/interfaces/drawer-breakpoint.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDrawerBreakpoint {
    id: number;
    config: {
        available: boolean;
        isFirst: boolean;
        isLast: boolean;
        inverted: boolean;
    }
    bounds: ISize;
    measures: {
        x: number;
        y: number;
        maxScrollSize: number;
    }
}
