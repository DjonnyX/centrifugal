import { Easing } from "../../../../common/utils/animator";

/**
 * IScrollToParams
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/core/nt-d-scroller/nt-d-scroll-view/interfaces/scroll-to-params.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IScrollToParams {
    x?: number | null;
    y?: number | null;
    left?: number | null;
    top?: number | null;
    normalize?: boolean;
    force?: boolean;
    blending?: boolean;
    behavior?: ScrollBehavior;
    ease?: Easing;
    fireUpdate?: boolean;
    userAction?: boolean;
    duration?: number;
}
