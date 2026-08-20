import { GradientColorPositions, IScrollingSettings, SnappingDistance } from "../../common";
import { Directions } from "../enums";
import { IAnimationParams } from "../interfaces";
import { Direction } from "../types";

export const DEFAULT_THUMB_GRADIENT_POSITIONS: GradientColorPositions = [0, 1];

export const DEFAULT_SLIDER_DIRECTION: Direction = Directions.HORIZONTAL;

export const DEFAULT_ANIMATION_PARAMS: IAnimationParams = {
    scroll: 500,
};

export const DEFAULT_SCROLLING_SETTINGS: IScrollingSettings = {
    frictionalForce: 0.015,
    mass: 0.005,
    maxDistance: 100000,
    maxDuration: 4000,
    speedScale: 10,
    breakpointStoppingFactor: 10,
    optimization: true,
};

export const DEFAULT_SNAPPING_DISTANCE: SnappingDistance = '25%';
