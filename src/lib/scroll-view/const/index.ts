import { TextDirections } from "../../common";
import { Directions } from "../enums/directions";
import { IAnimationParams, IScrollingSettings } from '../interfaces';

export const DEFAULT_LIST_SIZE = 400;

export const DEFAULT_CLICK_DISTANCE = 40;

export const DEFAULT_SCROLLABLE = true;

export const DEFAULT_SCROLLBAR_ENABLED = true;

export const DEFAULT_SCROLLBAR_INTERACTIVE = true;

export const DEFAULT_OVERLAPPING_SCROLLBAR = false;

export const DEFAULT_SCROLL_BEHAVIOR: ScrollBehavior = 'smooth';

export const DEFAULT_MOTION_BLUR = 0.15;

export const DEFAULT_MOTION_BLUR_ENABLED = false;

export const DEFAULT_MAX_MOTION_BLUR = 0.5;

export const DEFAULT_ANIMATION_PARAMS: IAnimationParams = {
    scrollToItem: 0,
};

export const DEFAULT_SCROLLING_SETTINGS: IScrollingSettings = {
    frictionalForce: 0.035,
    mass: 0.005,
    maxDistance: 100000,
    maxDuration: 4000,
    speedScale: 10,
    optimization: false,
};

export const DEFAULT_OVERSCROLL_ENABLED = true;

export const DEFAULT_SNAP_SCROLLTO_LEFT = true;

export const DEFAULT_SNAP_SCROLLTO_TOP = true;

export const DEFAULT_SNAP_SCROLLTO_RIGHT = true;

export const DEFAULT_SNAP_SCROLLTO_BOTTOM = true;

export const DEFAULT_DIRECTION = Directions.BOTH;

export const DISPLAY_OBJECTS_LENGTH_MESUREMENT_ERROR = 1;

export const DEFAULT_LANG_TEXT_DIR = TextDirections.LTR;

export const DEFAULT_SCROLLBAR_THICKNESS: number = 6;

export const DEFAULT_SCROLLBAR_MIN_SIZE: number = 80;

// presets

export const BEHAVIOR_AUTO: ScrollBehavior = 'auto';

export const BEHAVIOR_INSTANT: ScrollBehavior = 'instant';

export const BEHAVIOR_SMOOTH: ScrollBehavior = 'smooth';

export const SCROLL = 'scroll';

export const SCROLLER_SCROLL = 'scroll';

export const SCROLL_END = 'scrollend';

export const CLASS_SCROLL_VIEW_VERTICAL = 'vertical';

export const CLASS_SCROLL_VIEW_HORIZONTAL = 'horizontal';

export const CLASS_SCROLL_VIEW_BOTH = 'both';

// styles

export const MIN_PIXELS_FOR_PREVENT_SNAPPING = 10;

export const RANGE_DISPLAY_ITEMS_END_OFFSET = 20;

export const ROLE_LIST = 'list';

export const ROLE_LIST_BOX = 'listbox';

export const PERCENTAGE_VALUE_PATTERN = /^([\d]+%)$/;

export const Z_INDEX_NONE = '-1',
    Z_INDEX_0 = '0',
    Z_INDEX_1 = '1',
    Z_INDEX_2 = '2',
    Z_INDEX_3 = '3';