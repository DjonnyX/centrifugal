import { Color, GradientColor } from "@shared/types";
import { IMessageCreatorControlsTheme } from "./message-creator-controls-theme";

export interface IMessageCreatorTheme {
    background: string;
    input: {
        background: string;
        color: string;
        outline: string;
        focusedOutline: string;
        strokeGradientColor: GradientColor;
        rippleColor: Color;
    },
    controls: IMessageCreatorControlsTheme;
}
