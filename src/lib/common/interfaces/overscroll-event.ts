/**
 * IOverscrollEvent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/overscroll-event.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IOverscrollEvent {
    /**
     * x-axis scroll offset.
     */
    get dragX(): number;

    /**
     * y-axis scroll offset.
     */
    get dragY(): number;

    /**
     * x-axis scroll position.
     */
    get positionX(): 0 | 1;

    /**
     * y-axis scroll position.
     */
    get positionY(): 0 | 1;

    /**
     * Determines whether the ScrollView area is captured or not.
     */
    get grabbing(): boolean;
}