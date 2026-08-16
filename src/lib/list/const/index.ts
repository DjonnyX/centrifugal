import {
    Alignments, CollapsingModes, CollectionModes, SelectingModes, SnappingMethods, SnapToItemAligns, SpreadingModes,
} from "../enums";
import { Directions, SnappingDistance, SnapToItemAlign } from "../../common";
import { IAnimationParams } from '../interfaces';
import { SpreadingMode } from "../types";
import { Alignment } from "../types";

export const SERVICE_PROP_DUMMY_ID = '__service-dummy-id__';

export const SERVICE_PROP_DUMMY = '__service-dummy__';

export const SERVICE_TYPE_DUMMY = '__service-type-dummy__';

export const SERVICE_PROP_DUMMY_ENABLED = Symbol('__service-dummy-enabled__');

export const MAX_REGULAR_SNAPED_COMPONENTS = 2;

export const DEFAULT_ITEM_SIZE = 24;

export const DEFAULT_MIN_ITEM_SIZE = 1;

export const DEFAULT_MAX_ITEM_SIZE = Number.MAX_SAFE_INTEGER;

export const DEFAULT_BUFFER_SIZE = 2;

export const DEFAULT_MAX_BUFFER_SIZE = 10;

export const DEFAULT_LIST_SIZE = 400;

export const DEFAULT_WAIT_FOR_PREPARATION = true;

export const NAVIGATION_BY_KEYBOARD_TIMER = 50;

export const DEFAULT_SNAP_TO_ITEM = false;

export const DEFAULT_SNAP_TO_ITEM_ALIGN: SnapToItemAlign = SnapToItemAligns.CENTER;

export const DEFAULT_SNAPPING_DISTANCE: SnappingDistance = '25%';

export const DEFAULT_SCROLLING_ONE_BY_ONE = false;

export const DEFAULT_ALIGNMENT: Alignment = Alignments.NONE;

export const DEFAULT_SPREADING_MODE: SpreadingMode = SpreadingModes.NORMAL;

export const DEFAULT_DIVIDES = 1;

export const DEFAULT_ANIMATION_PARAMS: IAnimationParams = {
    scrollToItem: 150,
    snapToItem: 150,
    navigateToItem: 150,
    navigateByKeyboard: NAVIGATION_BY_KEYBOARD_TIMER,
};

export const DEFAULT_STICKY_ENABLED = false;

export const DEFAULT_SELECT_BY_CLICK = true;

export const DEFAULT_ZINDEX_WHEN_SELECTING = null;

export const DEFAULT_COLLAPSE_BY_CLICK = true;

export const DEFAULT_ENABLED_BUFFER_OPTIMIZATION = false;

export const DEFAULT_DYNAMIC_SIZE = true;

export const DEFAULT_SNAP_TO_END_TRANSITION_INSTANT_OFFSET = 1;

export const DEFAULT_SNAP_SCROLLTO_START = true;

export const DEFAULT_SNAP_SCROLLTO_END = true;

export const TRACK_BY_PROPERTY_NAME = 'id';

export const DEFAULT_DIRECTION = Directions.VERTICAL;

export const DEFAULT_COLLECTION_MODE = CollectionModes.NORMAL;

export const DISPLAY_OBJECTS_LENGTH_MESUREMENT_ERROR = 1;

export const MAX_SCROLL_TO_ITERATIONS = 5;

export const DEFAULT_SNAPPING_METHOD = SnappingMethods.STANDART;

export const DEFAULT_COLLAPSING_MODES = CollapsingModes.NONE;

export const DEFAULT_SELECTING_MODES = SelectingModes.NONE;

export const DEFAULT_SCREEN_READER_MESSAGE = 'Showing items $1 to $2';

// presets

export const DISABLED = 'disabled';

export const VIEWPORT = 'viewport';

export const SCROLL = 'scroll';

export const SCROLLER_SCROLL = 'scroll';

export const SCROLL_END = 'scrollend';

export const CLASS_LIST_VERTICAL = 'vertical';

export const CLASS_LIST_HORIZONTAL = 'horizontal';

// styles

export const PART_DEFAULT_ITEM = 'nt-list-item';

export const PART_ITEM_NEW = ' nt-list-item-new';

export const PART_ITEM_ODD = ' nt-list-item-odd';

export const PART_ITEM_EVEN = ' nt-list-item-even';

export const PART_ITEM_ROW_ODD = ' nt-list-item-row-odd';

export const PART_ITEM_ROW_EVEN = ' nt-list-item-row-even';

export const PART_ITEM_SNAPPED = ' nt-list-item-snapped';

export const PART_ITEM_SELECTED = ' nt-list-item-selected';

export const PART_ITEM_COLLAPSED = ' nt-list-item-collapsed';

export const PART_ITEM_FOCUSED = ' nt-list-item-focused';

export const PART_DEFAULT_ITEM_FX = 'nt-list-item-fx';

export const PART_ITEM_FX_NEW = ' nt-list-item-fx-new';

export const PART_ITEM_FX_ODD = ' nt-list-item-fx-odd';

export const PART_ITEM_FX_EVEN = ' nt-list-item-fx-even';

export const PART_ITEM_ROW_FX_ODD = ' nt-list-item-row-fx-odd';

export const PART_ITEM_ROW_FX_EVEN = ' nt-list-item-row-fx-even';

export const PART_ITEM_FX_SNAPPED = ' nt-list-item-fx-snapped';

export const PART_ITEM_FX_SELECTED = ' nt-list-item-fx-selected';

export const PART_ITEM_FX_COLLAPSED = ' nt-list-item-fx-collapsed';

export const PART_ITEM_FX_FOCUSED = ' nt-list-item-fx-focused';

export const MIN_PIXELS_FOR_PREVENT_SNAPPING = 10;

export const MAX_VELOCITY_FOR_SCROLL_QUALITY_OPTIMIZATION_LVL1 = 74;

export const MAX_NUMBERS_OF_SKIPS_FOR_QUALITY_OPTIMIZATION_LVL1 = 4;

export const RANGE_DISPLAY_ITEMS_END_OFFSET = 20;

export const PREPARE_ITERATIONS = 1;

export const PREPARATION_REUPDATE_LENGTH = 0;

export const PREPARE_ITERATIONS_FOR_UPDATE_ITEMS = 1;

export const PREPARATION_REUPDATE_LENGTH_FOR_UPDATE_ITEMS = 0;

export const PREPARE_ITERATIONS_FOR_COLLAPSE_ITEMS = 1;

export const PREPARATION_REUPDATE_LENGTH_FOR_COLLAPSE_ITEMS = 0;

export const EMPTY_SCROLL_STATE_VERSION = '-1';

export const ROLE_LIST = 'list';

export const ROLE_LIST_BOX = 'listbox';

export const ITEM_ID = 'item-id';

export const ITEM_CONTAINER = 'ntvl-item';

export const Z_INDEX_NONE = '-1',
    Z_INDEX_0 = '0',
    Z_INDEX_1 = '1',
    Z_INDEX_2 = '2',
    Z_INDEX_3 = '3';