import { IRect, IScrollOptions } from "../../../common";
import { INtBaseScrollViewService } from "../../../common/interfaces/nt-base-scroll-view-service";
import { INtScroller } from "../../../common/interfaces/nt-scroller";
import { Direction, Id } from "../../../common/types";

/**
 * INtDScrollerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/core/nt-d-scroller/interfaces/nt-d-scroller-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtDScrollerService extends INtBaseScrollViewService {
    initialize: (id: number, component: INtScroller<INtBaseScrollViewService>, parentService: INtBaseScrollViewService | null) => void;

    direction: Direction;

    scrollLeftOffset: number;

    scrollRightOffset: number;

    scrollTopOffset: number;

    scrollBottomOffset: number;

    getComponentBoundsByIntersectionPosition: (positionX: number, positionY: number, maxPositionX?: number | null, maxPositionY?: number | null) =>
        (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; }) | null;

    setIntersectionElementBySnapToItemAlign: (id: Id | null) => void;

    update(immediately?: boolean): void;

    scrollToLeft(options?: IScrollOptions): void;

    scrollToTop(options?: IScrollOptions): void;

    scrollToRight(options?: IScrollOptions): void;

    scrollToBottom(options?: IScrollOptions): void;
}