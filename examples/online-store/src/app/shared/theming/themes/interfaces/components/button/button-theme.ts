import { Color } from "@shared/types";
import { IButtonStateTheme } from "./button-state-theme";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IButtonTheme {
    rippleColor?: Color;
    normal: IButtonStateTheme;
    pressed: IButtonStateTheme;
    focused?: IButtonStateTheme;
    disabled: IButtonStateTheme;
}