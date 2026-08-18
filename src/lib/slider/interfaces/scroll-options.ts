import { IAnimatorUpdateData } from "../../common/utils/animator/interfaces";

/**
 * IScrollOptions
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/slider/interfaces/scroll-options.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IScrollOptions {
    /**\
     * Range from 0 to 1.
     */
    value?: number;
    /**
     * Scroll behavior.
     */
    behavior?: ScrollBehavior;
    /**
     * Fires when animation updated.
     */
    onUpdate?: ((data: IAnimatorUpdateData) => void) | null;
    /**
     * Fires when animation completed.
     */
    onComplete?: ((data: IAnimatorUpdateData) => void) | null;
    /**
     * Animation duration.
     */
    duration?: number;
}
