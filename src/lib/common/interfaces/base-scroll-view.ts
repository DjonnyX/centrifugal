import { IBaseScrollViewService } from "./base-scroll-view-service";
import { ISize } from "./size";
import { INtScroller } from "./nt-scroller";

export interface IBaseScrollView<S extends IBaseScrollViewService, P extends IBaseScrollViewService, C = INtScroller<S>> {
    get id(): number;

    get service(): S;

    get parentService(): P | null;

    get component(): C | undefined;

    get scrollLeft(): number;

    get scrollTop(): number;

    get scrollWidth(): number;

    get scrollHeight(): number;

    get bounds(): ISize;
}