import { IOverscrollEvent } from "../interfaces";
import { IOverscrollEventParams } from "./interfaces";

/**
 * OverscrollEvent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/events/overscroll-event.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export class OverscrollEvent implements IOverscrollEvent {
    private _dragX: number;
    get dragX() { return this._dragX; }

    private _dragY: number;
    get dragY() { return this._dragY; }

    private _positionX: 0 | 1;
    get positionX() { return this._positionX; }

    private _positionY: 0 | 1;
    get positionY() { return this._positionY; }

    private _grabbing: boolean;
    get grabbing() { return this._grabbing; }

    constructor(params: IOverscrollEventParams) {
        const { grabbing, dragX, dragY, positionX, positionY } = params;
        this._grabbing = grabbing;
        this._dragX = dragX;
        this._dragY = dragY;
        this._positionX = positionX;
        this._positionY = positionY;
    }
}