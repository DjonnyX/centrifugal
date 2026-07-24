import { INSTANT_VELOCITY_SCALE } from "../const";

/**
 * calculateVelocity
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-scroll-view/utils/calculate-velocity.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const calculateVelocity = (startPosition: number, currentPosition: number, timestamp: number) => {
    const s = currentPosition - startPosition, t = timestamp;
    return t !== 0 ? (s / t) * INSTANT_VELOCITY_SCALE : 0;
}