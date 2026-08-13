import { SheetPositions } from '../enums';
import { IAnimationParams } from '../interfaces/animation-params';
import { SheetPosition } from '../types';

export const DEFAULT_ANIMATION_PARAMS: IAnimationParams = {
    fadeIn: 500,
    fadeOut: 500,
};

export const DEFAULT_SHEET_SIZE = 320;

export const DEFAULT_POSITION: SheetPosition = SheetPositions.BOTTOM;

export const CLASS_SHEET_VERTICAL = 'vertical';

export const CLASS_SHEET_HORIZONTAL = 'horizontal';

export const MIN_PIXELS_FOR_PREVENT_SNAPPING = 10;
