import { Easing } from "../../common/utils/animator";

/**
 * Interface IScrollOptions.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/scroll-options.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IScrollOptions {
    x?: number | null;
    y?: number | null;
    left?: number | null;
    top?: number | null;
    blending?: boolean;
    behavior?: ScrollBehavior;
    ease?: Easing;
    duration?: number;
}
