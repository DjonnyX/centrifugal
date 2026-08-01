/**
 * IOverscrollEventParams
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/events/interfaces/overscroll-event-params.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IOverscrollEventParams {
    dragX: number;
    dragY: number;
    positionX: 0 | 1;
    positionY: 0 | 1;
}