import { Directions } from "../../../../../common";

/**
 * ICalculateScrollParams
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-scroller/utils/interfaces/calculate-scroll-params.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface ICalculateScrollParams {
    direction: Directions;
    viewportWidth: number;
    viewportHeight: number;
    contentWidth: number;
    contentHeight: number;
    startOffset: number;
    endOffset: number;
    positionX: number;
    positionY: number;
    minSize: number;
}