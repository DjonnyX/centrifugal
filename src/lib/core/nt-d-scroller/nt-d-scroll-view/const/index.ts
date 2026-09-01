import { SnappingDistance, SnapToItemAlign, SnapToItemAligns } from "../../../../common";
import { ScrollerTypes } from "../../../../common/enums/scroller-types";
import { INtDScrollViewAnimationParams } from "../interfaces";

export const DURATION = 2000,
    FRICTION_FORCE = .035,
    MAX_DURATION = 4000,
    ANIMATION_DURATION = 50,
    MASS = .005,
    ACCELERATION_SCALE = 40,
    MAX_DIST = 12500,
    MIN_DELTA = 0.1,
    MAX_VELOCITY_TIMESTAMP = 100,
    MAX_VELOCITIES_LENGTH = 10,
    MIN_ACCELERATION = 0.001,
    SPEED_SCALE = 15,
    OVERSCROLL_START_ITERATION = 2,
    OVERSCROLL_EFFECT_TIME = 500;

export const MAX_ITERATIONS_FOR_AVERAGE_CALCULATIONS = 5,
    INSTANT_VELOCITY_SCALE = 1000;

export const DEFAULT_ANIMATION_PARAMS: INtDScrollViewAnimationParams = {
    scrollToItem: 500,
    snapToItem: 250,
};

export const DEFAULT_SNAP_TO_ITEM: boolean = false;

export const DEFAULT_SCROLLING_ONE_BY_ONE: boolean = false;

export const DEFAULT_SNAP_TO_ITEM_ALIGN: SnapToItemAlign = SnapToItemAligns.START;

export const DEFAULT_SNAPPING_DISTANCE: SnappingDistance = '25%';

export const EXCLUDED_CONTAINERS = [ScrollerTypes.CONTROL_CONTAINER, ScrollerTypes.DRAWER];

export const FULL_SIZE = 'full-size';
