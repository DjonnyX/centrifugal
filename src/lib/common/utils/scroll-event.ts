import { Directions } from "../enums";
import { IScrollViewScrollEvent, ISize } from "../interfaces";
import { Direction, ScrollDirection } from "../types";

interface IScrollEventParams {
    bounds: ISize;
    directionX: ScrollDirection;
    directionY: ScrollDirection;
    scrollerDirection: Direction;
    scrollWidth: number;
    scrollHeight: number;
    isRight: boolean;
    isBottom: boolean;
    userAction: boolean;
}

/**
 * ScrollEvent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/scroll-event.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export class ScrollEvent implements IScrollViewScrollEvent {
    private _scrollerDirection: Direction = Directions.BOTH;
    get scrollerDirection() { return this._scrollerDirection; }

    private _directionX: ScrollDirection = 0;
    get directionX() { return this._directionX; }

    private _directionY: ScrollDirection = 0;
    get directionY() { return this._directionY; }

    private _scrollWidth: number = 0;
    get scrollWidth() { return this._scrollWidth; }

    private _scrollHeight: number = 0;
    get scrollHeight() { return this._scrollHeight; }

    private _viewportWidth: number = 0;
    get viewportWidth() { return this._viewportWidth; }

    private _viewportHeight: number = 0;
    get viewportHeight() { return this._viewportHeight; }

    private _isLeft: boolean = true;
    get isLeft() { return this._isLeft; }

    private _isRight: boolean = false;
    get isRight() { return this._isRight; }

    private _isTop: boolean = true;
    get isTop() { return this._isTop; }

    private _isBottom: boolean = false;
    get isBottom() { return this._isBottom; }

    private _userAction: boolean;
    get userAction() { return this._userAction; }

    constructor(params: IScrollEventParams) {
        const { bounds, directionX, directionY, scrollerDirection, scrollWidth, scrollHeight, isRight, isBottom, userAction } = params;
        this._scrollerDirection = scrollerDirection;
        this._directionX = directionX;
        this._directionY = directionY;
        this._viewportWidth = bounds.width;
        this._viewportHeight = bounds.height;
        this._scrollWidth = scrollWidth;
        this._scrollHeight = scrollHeight;
        this._isLeft = this._scrollWidth === 0;
        this._isRight = isRight;
        this._isTop = this._scrollHeight === 0;
        this._isBottom = isBottom;
        this._userAction = userAction;
    }
}