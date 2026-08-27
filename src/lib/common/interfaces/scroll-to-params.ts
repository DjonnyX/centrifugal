import { Easing } from "../utils";
import { IAnimatorUpdateData } from "../utils/animator/interfaces";

/**
 * IScrollToParams
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/scroll-to-params.ts
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
    snap?: boolean;
    blending?: boolean;
    behavior?: ScrollBehavior;
    ease?: Easing;
    onUpdate?: ((data: IAnimatorUpdateData) => void) | null;
    onComplete?: ((data: IAnimatorUpdateData) => void) | null;
    fireUpdate?: boolean;
    userAction?: boolean;
    duration?: number;
}
