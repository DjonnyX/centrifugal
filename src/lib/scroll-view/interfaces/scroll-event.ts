import { Direction } from "../types";
import { ScrollDirection } from "../types/scroll-direction";

/**
 * Interface IScrollEvent.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/scroll-event.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IScrollEvent {
    /**
     * Scroll area width
     */
    scrollWidth: number;
    /**
     * Scroll area height
     */
    scrollHeight: number;
    /**
     * Viewport width
     */
    viewportWidth: number;
    /**
     * Viewport height
     */
    viewportHeight: number;
    /**
     * The scroller orientation.
     */
    scrollerDirection: Direction;
    /**
     * A value of -1 indicates the direction is up or left (if the list direction is horizontal).
     * A value of 1 indicates the direction is down or right (if the list direction is horizontal).
     */
    directionX: ScrollDirection;
    /**
     * A value of -1 indicates the direction is up or left (if the list direction is horizontal).
     * A value of 1 indicates the direction is down or right (if the list direction is horizontal).
     */
    directionY: ScrollDirection;
    /**
     * If true then indicates that the list has been scrolled to the left side.
     */
    isLeft: boolean;
    /**
     * If true then indicates that the list has been scrolled to the right side.
     */
    isRight: boolean;
    /**
     * If true then indicates that the list has been scrolled to the top side.
     */
    isTop: boolean;
    /**
     * If true then indicates that the list has been scrolled to the bottom side.
     */
    isBottom: boolean;
    /**
     * Has user action
     */
    userAction: boolean;
}
