import { GradientColor, RoundedCorner } from "../../../../../types";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IButtonStateTheme {
    background?: string;
    color?: string;
    fill?: string | GradientColor;
    strokeGradientColor?: GradientColor;
    roundedCorner?: RoundedCorner;
    outline?: string;
    iconFill?: string;
    padding?: string;
}