import { Color, GradientColor, RoundedCorner } from "../../../../../types";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IScrollBarTheme {
    fill: GradientColor;
    strokeGradientColor: GradientColor;
    strokeAnimationDuration: number;
    thickness: number;
    roundCorner: RoundedCorner;
    rippleColor: Color;
}
