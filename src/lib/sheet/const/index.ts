import { IScrollingSettings } from '../../common';
import { SheetPositions } from '../enums';
import { INtSheetBreakpoints } from '../interfaces';
import { IAnimationParams } from '../interfaces/animation-params';
import { SheetPosition } from '../types';

export const DEFAULT_ANIMATION_PARAMS: IAnimationParams = {
    fadeIn: 500,
    fadeOut: 500,
};

export const DEFAULT_OPENING_BREAKPOINTS: INtSheetBreakpoints = [
    { id: 'start', position: '0%' },
    { id: 'end', position: '100%' },
];

export const DEFAULT_SCROLLING_SETTINGS: IScrollingSettings = {
    frictionalForce: 0.035,
    mass: 0.005,
    maxDistance: 100000,
    maxDuration: 4000,
    speedScale: 10,
    breakpointStoppingFactor: 0.25,
    optimization: false,
};

export const DEFAULT_BREAKPOINT_TRIGGER_DISTANCE: number = 0.1;

export const DEFAULT_SHEET_SIZE = 320;

export const DEFAULT_POSITION: SheetPosition = SheetPositions.BOTTOM;

export const CLASS_SHEET_VERTICAL = 'vertical';

export const CLASS_SHEET_HORIZONTAL = 'horizontal';
