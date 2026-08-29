import { Signal } from "@angular/core";
import { IScrollToParams } from "./scroll-to-params";
import { ISize } from "./size";
import { INtBaseScrollViewService } from "./nt-base-scroll-view-service";
import { INtBaseScrollView } from "./nt-base-scroll-view";
import { Observable } from "rxjs";
import { IOverscrollEvent } from "./overscroll-event";

/**
 * INtScroller
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/nt-scroller.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtScroller<S extends INtBaseScrollViewService> {
    get service(): S;

    get grabbing(): boolean;

    get userActionDuringAnimation(): boolean;

    get type(): string | null;

    get parent(): INtBaseScrollView<S, S> | null;

    get contentElement(): HTMLDivElement | null;

    get offsetLeft(): number;

    set offsetLeft(v: number);

    get offsetTop(): number;

    set offsetTop(v: number);

    get offsetRight(): number;

    get offsetBottom(): number;

    set scrollLeft(v: number);
    get scrollLeft(): number;

    set scrollTop(v: number);
    get scrollTop(): number;

    get scrollWidth(): number;

    get scrollHeight(): number;

    readonly viewportBounds: Signal<ISize>;

    readonly contentBounds: Signal<ISize>;

    readonly $resizeViewport: Observable<ISize>;

    readonly $overscroll: Observable<IOverscrollEvent>;

    readonly $overscrollEffectEvent: Observable<IOverscrollEvent>;

    scroll(params: IScrollToParams): Array<number> | number | null;

    stopScrolling(force?: boolean): void;

    setClientPositionOffset(x: number, y: number): void;
}