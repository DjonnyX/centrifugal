import { Directions, IScrollingSettings, SnappingDistance, SnapToItemAlign, SnapToItemAligns } from "../../common";
import { SDirection } from "../../core/nt-s-scroller/types";
import { INtListAnimationParams } from "../../list";
import { ITabsTemplateContext } from "../interfaces";

export const DEFAULT_SWITCH_DIRECTION: SDirection = Directions.HORIZONTAL;

export const TRACK_BY_PROPERTY_NAME: string = 'id';

export const DEFAULT_TEMPLATE_CONTEXT: ITabsTemplateContext = {
    width: 0,
    height: 0,
    params: {},
};

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

export const DEFAULT_SNAP_TO_ITEM = true;

export const DEFAULT_SNAP_TO_ITEM_ALIGN: SnapToItemAlign = SnapToItemAligns.START;

export const DEFAULT_SNAPPING_DISTANCE: SnappingDistance = '20%';

export const DEFAULT_OVERSCROLL_ENABLED: boolean = false;
