import { Observable } from "rxjs";
import { Id, IRect, ISize } from "../../../common";
import { INtBaseScrollViewService } from "../../../common/interfaces/nt-base-scroll-view-service";

/**
 * INtSScrollerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/core/nt-s-scroller/interfaces/nt-s-scroller-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtSScrollerService extends INtBaseScrollViewService {
    lastFocusedItemId: number;

    scrollStartOffset: number;

    scrollEndOffset: number;

    isVertical?: boolean;

    snapScrollToStart: boolean;

    snapScrollToEnd: boolean;

    scrollBarSize: number;

    dynamic: boolean;

    snapToItem: boolean;

    readonly $tick: Observable<void>;

    readonly $intersectionElementBySnapToItemAlign: Observable<Id | null>;

    update(immediately?: boolean): void;

    getItemBounds(id: Id): ISize | null;

    getComponentBoundsByIntersectionPosition(position: number, maxPosition?: number | null):
        (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; }) | null;

    setIntersectionElementBySnapToItemAlign(id: Id | null): void;

    scrollToStart(options?: any): void;

    scrollToEnd(options?: any): void;
}