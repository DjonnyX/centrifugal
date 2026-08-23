import { Easing } from "../../../../common/utils";

/**
 * IScrollToParams
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/components/nt-scroll-view/interfaces/scroll-to-params.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IScrollToParams {
    x?: number;
    y?: number;
    left?: number;
    top?: number;
    snap?: boolean;
    normalize?: boolean;
    force?: boolean;
    blending?: boolean;
    behavior?: ScrollBehavior;
    ease?: Easing;
    fireUpdate?: boolean;
    userAction?: boolean;
    duration?: number;
}
