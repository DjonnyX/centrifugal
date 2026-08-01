import { IBaseScrollViewService } from "./base-scroll-view-service";
import { ISize } from "./size";
import { INtScroller } from "./nt-scroller";

/**
 * IBaseScrollView
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/base-scroll-view.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IBaseScrollView<S extends IBaseScrollViewService, P extends IBaseScrollViewService, C = INtScroller<S>> {
    get id(): number;

    get service(): S;

    get host(): HTMLElement;

    get parentService(): P | null;

    get component(): C | undefined;

    get scrollLeft(): number;

    get scrollTop(): number;

    get scrollWidth(): number;

    get scrollHeight(): number;

    get bounds(): ISize;
}