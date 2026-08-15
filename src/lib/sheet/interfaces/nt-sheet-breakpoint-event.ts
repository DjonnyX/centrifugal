import { SheetPosition } from "../types";

/**
 * INtSheetBreakpointEvent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/interfaces/nt-sheet-breakpoint-event.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtSheetBreakpointEvent {
    /**
     * Breakpoint Id
     */
    id: string | null;
    /**
     * Breakpoint index
     */
    index: number;
    /**
     * Coefficient of the turning point to the current position
     */
    breakpointRatio: number;
    /**
     * Total size coefficient from current position
     */
    ratio: number;
    /**
     * Sheet positions of the scroll view.
     */
    position: SheetPosition;
    /**
     * Indicates whether the sheet is vertical or horizontally oriented.
     */
    isVertical: boolean;
}
