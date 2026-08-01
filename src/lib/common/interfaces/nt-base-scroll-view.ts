import { INtBaseScrollViewService } from "./nt-base-scroll-view-service";
import { ISize } from "./size";
import { INtScroller } from "./nt-scroller";

/**
 * INtBaseScrollView
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/nt-base-scroll-view.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtBaseScrollView<S extends INtBaseScrollViewService, P extends INtBaseScrollViewService, C = INtScroller<S>> {
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