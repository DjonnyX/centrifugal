import { isTouchSupported } from '../../common/utils/is-touch-supported';
import { IPoint } from '../../common/interfaces';

export const getClientPoint = (e: PointerEvent | TouchEvent): IPoint | null => {
    if (!isTouchSupported()) {
        const event = e as PointerEvent;
        return { x: event.clientX, y: event.clientY };
    } else {
        const event = e as TouchEvent,
            touch = (event.targetTouches?.length ?? 0) > 0 ? event.targetTouches[event.targetTouches.length - 1] : null;
        if (!!touch) {
            return {
                x: touch.clientX,
                y: touch.clientY,
            };
        }

    }
    return null;
}