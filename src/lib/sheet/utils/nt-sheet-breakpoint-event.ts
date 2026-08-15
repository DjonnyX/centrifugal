import { SheetPositions } from '../enums';
import { INtSheetBreakpointEvent } from '../interfaces';
import { SheetPosition } from '../types';

interface IBreakpointEventParams {
    id: string;
    index: number;
    breakpointRatio: number;
    ratio: number;
    position: SheetPosition;
    isVertical: boolean;
}

/**
 * Scroll event.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/utils/nt-sheet-breakpoint-event.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export class NtSheetBreakpointEvent implements INtSheetBreakpointEvent {
    private _id: string | null = null;
    get id() { return this._id; }

    private _index: number = 0;
    get index() { return this._index; }

    private _breakpointRatio: number = 0;
    get breakpointRatio() { return this._breakpointRatio; }

    private _ratio: number = 0;
    get ratio() { return this._ratio; }

    private _position: SheetPosition = SheetPositions.BOTTOM;
    get position() { return this._position; }

    private _isVertical: boolean;
    get isVertical() { return this._isVertical; }

    constructor(params: IBreakpointEventParams) {
        const { id, index, breakpointRatio, ratio, position, isVertical } = params;
        this._id = id;
        this._index = index;
        this._breakpointRatio = breakpointRatio;
        this._ratio = ratio;
        this._position = position;
        this._isVertical = isVertical;
    }
}