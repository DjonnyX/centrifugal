import { Id } from "../../common";

/**
 * IScrollParams
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/interfaces/scroll-options.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IScrollParams {
    id: Id;
    behavior?: ScrollBehavior;
    blending?: boolean;
    iteration?: number;
    isLastIteration?: boolean;
    scrollCalled?: boolean;
    delay?: number;
    cb?: () => void;
}
