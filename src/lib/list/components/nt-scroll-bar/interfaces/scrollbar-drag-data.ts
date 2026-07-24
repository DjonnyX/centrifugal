/**
 * IScrollBarDragEvent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/components/ng-scroll-bar/interfaces/scrollbar-drag-data.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IScrollBarDragEvent {
    position: number;
    min: number;
    max: number;
    userAction: boolean;
    animation: boolean;
}
