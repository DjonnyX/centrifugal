import { Directions, IScrollingSettings } from "../../common";
import { SDirection } from "../../core/nt-s-scroller/types";
import { INtListAnimationParams } from "../../list";

export const DEFAULT_SWITCH_DIRECTION: SDirection = Directions.HORIZONTAL;

export const TRACK_BY_PROPERTY_NAME: string = 'id';

export const DEFAULT_SCROLLING_SETTINGS: IScrollingSettings = {
    frictionalForce: 0.035,
    mass: 0.005,
    maxDistance: 100000,
    maxDuration: 4000,
    speedScale: 10,
    breakpointStoppingFactor: 0.01,
    optimization: false,
};

export const DEFAULT_ANIMATION_PARAMS: INtListAnimationParams = {
    scrollToItem: 500,
    snapToItem: 500,
    navigateToItem: 500,
    navigateByKeyboard: 150,
};
