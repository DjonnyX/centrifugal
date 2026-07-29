import { Signal } from "@angular/core";
import { IScrollToParams } from "./scroll-to-params";
import { ISize } from "./size";
import { IBaseScrollViewService } from "./base-scroll-view-service";

/**
 * INtScroller
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/nt-scroller.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtScroller<S extends IBaseScrollViewService> {
    get service(): S;

    set scrollLeft(v: number);
    get scrollLeft(): number;

    set scrollTop(v: number);
    get scrollTop(): number;

    get scrollWidth(): number;

    get scrollHeight(): number;

    readonly viewportBounds: Signal<ISize>;

    readonly contentBounds: Signal<ISize>;

    scroll(params: IScrollToParams): Array<number> | number | null;
}