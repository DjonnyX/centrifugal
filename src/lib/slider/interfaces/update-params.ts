import { GradientColorPositions } from "../../common";

/**
 * IUpdateParams
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/slider/interfaces/update-params.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IUpdateParams {
    size: number;
    position: number;
    gradientPositions: GradientColorPositions;
    animated: boolean;
    userAction: boolean;
}