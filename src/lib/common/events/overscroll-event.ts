import { IOverscrollEvent } from "../interfaces";
import { IOverscrollEventParams } from "./interfaces";

export class OverscrollEvent implements IOverscrollEvent {
    private _dragX: number;
    get dragX() { return this._dragX; }

    private _dragY: number;
    get dragY() { return this._dragY; }

    private _positionX: 0 | 1;
    get positionX() { return this._positionX; }

    private _positionY: 0 | 1;
    get positionY() { return this._positionY; }

    constructor(params: IOverscrollEventParams) {
        const { dragX, dragY, positionX, positionY } = params;
        this._dragX = dragX;
        this._dragY = dragY;
        this._positionX = positionX;
        this._positionY = positionY;
    }
}