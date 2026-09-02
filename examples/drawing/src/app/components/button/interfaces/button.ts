import { GradientColor, GradientColorPositions, RoundedCorner } from "../../../types";
import { SubstarateMode, SubstarateStyle } from "../../x-substrate/types";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IButton {
    mode: SubstarateMode;
    type: SubstarateStyle;
    content: string;
    strokeColor: GradientColor;
    roundCorner: RoundedCorner;
    disabled: boolean;
    fillColors: GradientColor;
    fillPositions: GradientColorPositions;
    preset: string;
}