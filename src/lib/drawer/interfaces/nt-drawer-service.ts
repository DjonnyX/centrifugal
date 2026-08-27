import { Observable } from "rxjs";
import { Direction, Id, IRect, IScrollOptions, ISize } from "../../common";
import { IAnimationParams, INtScrollViewService } from "../../scroll-view";
import { INtBaseScrollViewService } from "../../common/interfaces/nt-base-scroll-view-service";
import { INtScroller } from "../../common/interfaces/nt-scroller";
import { IDrawerBreakpoints } from "./drawer-breakpoints";

/**
 * INtDrawerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/drawer/interfaces/drawer-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtDrawerService extends INtScrollViewService {
    animationParams: IAnimationParams;

    direction: Direction;

    scrollLeftOffset: number;

    scrollRightOffset: number;

    scrollTopOffset: number;

    scrollBottomOffset: number;

    breakpoints: IDrawerBreakpoints | null;

    bounds: ISize | null;

    get scrollBarSize(): number;

    set scrollBarSize(v: number);

    readonly $scrollBarSize: Observable<number>;

    readonly $tick: Observable<void>;

    initialize: (id: number, scrollView: INtScroller<INtBaseScrollViewService>, parentService: INtBaseScrollViewService | null) => void;

    getComponentBoundsByIntersectionPosition: (positionX: number, positionY: number, maxPositionX?: number | null, maxPositionY?: number | null) =>
        (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; }) | null;

    setIntersectionElementBySnapToItemAlign: (id: Id | null) => void;

    getAccessibilityOfMovement(positionX: number, positionY: number, maxPositionX: number | null, maxPositionY: number | null): boolean;

    update: (immediately?: boolean) => void;

    scrollToLeft: (options?: IScrollOptions) => void;

    scrollToRight: (options?: IScrollOptions) => void;

    scrollToTop: (options?: IScrollOptions) => void;

    scrollToBottom: (options?: IScrollOptions) => void;
}