import { SnappingDistance, SnapToItemAlign, SnapToItemAligns } from "../../../../common";
import { SCROLLER_SCROLL } from "../../../../common/const/scroller";
import { INtSScrollViewAnimationParams } from "../interfaces";

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

export const SCROLL_EVENT = new Event(SCROLLER_SCROLL);

export const DEFAULT_ANIMATION_PARAMS: INtSScrollViewAnimationParams = {
    snapToItem: 150,
};

export const DEFAULT_SNAPPING_DISTANCE: SnappingDistance = '25%';

export const DEFAULT_SCROLLING_ONE_BY_ONE = false;

export const DEFAULT_SNAP_TO_ITEM = false;

export const DEFAULT_SNAP_TO_ITEM_ALIGN: SnapToItemAlign = SnapToItemAligns.CENTER;
