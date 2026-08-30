import { Directions, SnappingDistance } from '../../common';
import { INtScrollViewAnimationParams } from '../interfaces';

export const DEFAULT_SCROLLER_SIZE = 400;

export const DEFAULT_ANIMATION_PARAMS: INtScrollViewAnimationParams = {
    scrollToItem: 500,
    snapToItem: 250,
};

export const DEFAULT_SNAPPING_DISTANCE: SnappingDistance = '25%';

export const DEFAULT_DIRECTION = Directions.BOTH;

export const DISPLAY_OBJECTS_LENGTH_MESUREMENT_ERROR = 1;

// presets
export const SCROLL = 'scroll';

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