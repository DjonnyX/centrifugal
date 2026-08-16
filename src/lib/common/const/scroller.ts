import { TextDirections } from "../enums";
import { IScrollingSettings } from "../interfaces/scrolling-settings";

export const DEFAULT_SCROLLING_SETTINGS: IScrollingSettings = {
    frictionalForce: 0.035,
    mass: 0.005,
    maxDistance: 100000,
    maxDuration: 4000,
    speedScale: 10,
    breakpointStoppingFactor: 0.01,
    optimization: false,
};

export const DEFAULT_MOTION_BLUR = 0.15;

export const DEFAULT_MOTION_BLUR_ENABLED = false;

export const DEFAULT_MAX_MOTION_BLUR = 0.5;

export const DEFAULT_SCROLL_BEHAVIOR: ScrollBehavior = 'smooth';

export const DEFAULT_SCROLLABLE = true;

export const DEFAULT_SCROLLBAR_ENABLED = true;

export const DEFAULT_SCROLLBAR_INTERACTIVE = true;

export const DEFAULT_OVERLAPPING_SCROLLBAR = false;

export const DEFAULT_OVERSCROLL_ENABLED = true;

export const DEFAULT_SNAP_SCROLLTO_LEFT = true;

export const DEFAULT_SNAP_SCROLLTO_TOP = true;

export const DEFAULT_SNAP_SCROLLTO_RIGHT = true;

export const DEFAULT_SNAP_SCROLLTO_BOTTOM = true;

export const DEFAULT_SCROLLBAR_THICKNESS: number = 6;

export const DEFAULT_SCROLLBAR_MIN_SIZE: number = 80;

export const DEFAULT_LANG_TEXT_DIR = TextDirections.LTR;
