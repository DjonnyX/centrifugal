const ON_TOUCH_START = 'ontouchstart';

export const isTouchSupported = () => {
    return ON_TOUCH_START in window ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
};