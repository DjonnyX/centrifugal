import { INtSheetBreakpointInfo, ISheetPrecalculatedBreakpoint, ISheetPrecalculatedBreakpoints } from '../interfaces';

export const getBreakpointByPosition = (breakpoints: ISheetPrecalculatedBreakpoints, position: number, maxPosition: number):
    INtSheetBreakpointInfo | null => {
    let prevBreakpoint: ISheetPrecalculatedBreakpoint | null = null;
    for (let li = breakpoints.length - 1, i = li; i >= 0; i--) {
        const breakpoint = breakpoints[i], breakpointPosition = breakpoint.position,
            prevBreakpointPosition = prevBreakpoint !== null ? prevBreakpoint.position : 0;
        if ((position > prevBreakpointPosition) && (position <= breakpointPosition)) {
            const distanceBetweenBreakpoints = Math.abs(breakpointPosition - prevBreakpointPosition),
                ratio = maxPosition !== 0 ? (position / maxPosition) : 0,
                distanceBetweenCurrentPosition = Math.abs(position - prevBreakpointPosition),
                breakpointRatio = distanceBetweenBreakpoints !== 0 ? (distanceBetweenCurrentPosition / distanceBetweenBreakpoints) : 0;
            return {
                index: i,
                id: breakpoint.id,
                ratio,
                breakpointRatio,
            };
        }
        prevBreakpoint = breakpoint;
    }
    return null;
}

