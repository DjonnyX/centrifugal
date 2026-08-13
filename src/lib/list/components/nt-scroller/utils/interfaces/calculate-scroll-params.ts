import { Direction } from "../../../../types";

/**
 * ICalculateScrollMetrics
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/components/scroller/utils/interfaces/calculate-scroll-params.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface ICalculateScrollParams {
    direction: Direction;
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