import { Easing } from "../../common/utils/animator";
import { IAnimatorUpdateData } from "../../common/utils/animator/interfaces";

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
    onUpdate?: ((data: IAnimatorUpdateData) => void) | null;
    onComplete?: ((data: IAnimatorUpdateData) => void) | null;
    ease?: Easing;
    duration?: number;
}
