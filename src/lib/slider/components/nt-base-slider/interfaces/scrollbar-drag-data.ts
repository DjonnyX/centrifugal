/**
 * ISliderDragEvent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/slider/components/ng-base-slider/interfaces/slider-drag-data.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface ISliderDragEvent {
    position: number;
    min: number;
    max: number;
    userAction: boolean;
    animation: boolean;
    isVertical: boolean;
}
