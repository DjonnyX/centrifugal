import { ArithmeticExpression, GradientColorPositions, IScrollingSettings, SnappingDistance } from "../../common";
import { SDirection } from "../../core/nt-s-scroller/types";
import { Directions } from "../enums";
import { IAnimationParams } from "../interfaces";

export const DEFAULT_THUMB_GRADIENT_POSITIONS: GradientColorPositions = [0, 1];

export const DEFAULT_SLIDER_DIRECTION: SDirection = Directions.HORIZONTAL;

export const DEFAULT_OVERSCROLL_ENABLED = false;

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

export const DEFAULT_SNAPPING_DISTANCE: SnappingDistance = '50%';

export const DEFAULT_SIZE = 6;

export const DEFAULT_MOTION_BLUR = 2;

export const DEFAULT_MAX_MOTION_BLUR = 5;

export const DEFAULT_MOTION_BLUR_ENABLED = false;

export const DEFAULT_THUMB_SIZE: ArithmeticExpression = '25%';
