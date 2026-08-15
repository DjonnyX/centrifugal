import { ISheetPrecalculatedBreakpoints } from '../interfaces';

export const getBreakpointByPosition = (breakpoints: ISheetPrecalculatedBreakpoints,
    triggerDistance: number, position: number,
): number => {
    const totalDistance = Math.abs(breakpoints[breakpoints.length - 1].position - breakpoints[0].position),
        minTriggerDistance = totalDistance * triggerDistance;
    for (let li = breakpoints.length - 1, i = li; i >= 0; i--) {
        const breakpoint = breakpoints[i], breakpointPosition = breakpoint.position;
        if ((position > (breakpointPosition - minTriggerDistance)) && (position <= (breakpointPosition + minTriggerDistance))) {
            return i;
        }
    }
    return -1;
}
