import { ISize } from "../../common";

/**
 * Interface ISliderStep
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/interfaces/slider-step.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface ISliderStep {
    id: string;
    config: {
        isFirst: boolean;
        isLast: boolean;
        inverted: boolean;
        isVertical: boolean;
    }
    bounds: ISize;
    measures: {
        x: number;
        y: number;
        maxScrollSize: number;
    }
}
