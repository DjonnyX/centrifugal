import { GradientColorPositions } from "../../common";
import { Directions } from "../enums";
import { IAnimationParams } from "../interfaces";
import { Direction } from "../types";

export const DEFAULT_THUMB_GRADIENT_POSITIONS: GradientColorPositions = [0, 1];

export const DEFAULT_SLIDER_DIRECTION: Direction = Directions.HORIZONTAL;

export const DEFAULT_ANIMATION_PARAMS: IAnimationParams = {
    scroll: 500,
};

