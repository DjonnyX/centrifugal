import { ArithmeticExpression, Directions, SnappingDistance } from "../../common";
import { SDirection } from "../../core/nt-s-scroller/types";
import { INtSwitchAnimationParams } from "../interfaces";

export const DEFAULT_SWITCH_DIRECTION: SDirection = Directions.HORIZONTAL;

export const DEFAULT_ANIMATION_PARAMS: INtSwitchAnimationParams = {
    scroll: 500,
    snapByDivision: 250,
};

export const DEFAULT_CONTENT_SCALE = 1.05;

export const DEFAULT_THUMB_ANIMATION_DURATION: string = '150ms';

export const DEFAULT_THUMB_SIZE: ArithmeticExpression = '50%';

export const DEFAULT_SNAPPING_DISTANCE: SnappingDistance = '50%';

export const DEFAULT_MOTION_BLUR = 5;

export const DEFAULT_MAX_MOTION_BLUR = 10;

export const DEFAULT_MOTION_BLUR_ENABLED = false;

