import { Observable } from "rxjs";
import { Direction, Id, IRect, IScrollOptions } from "../../common";
import { IAnimationParams } from "../../scroll-view";
import { INtBaseScrollViewService } from "../../common/interfaces/nt-base-scroll-view-service";
import { INtScroller } from "../../common/interfaces/nt-scroller";

/**
 * INtDrawerContainerService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/drawer-container/interfaces/drawer-container-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtDrawerContainerService extends INtBaseScrollViewService {
    initialize: (id: number, scrollView: INtScroller<INtBaseScrollViewService>, parentId: number, emitter: HTMLElement) => void;

    animationParams: IAnimationParams;

    direction: Direction;

    scrollLeftOffset: number;

    scrollRightOffset: number;

    scrollTopOffset: number;

    scrollBottomOffset: number;

    snapScrollToLeft: boolean;

    snapScrollToRight: boolean;

    snapScrollToTop: boolean;

    snapScrollToBottom: boolean;

    get scrollBarSize(): number;

    set scrollBarSize(v: number);

    readonly $scrollBarSize: Observable<number>;

    readonly $tick: Observable<void>;

    getComponentBoundsByIntersectionPosition: (positionX: number, positionY: number, maxPositionX?: number | null, maxPositionY?: number | null) =>
        (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; }) | null;

    setIntersectionElementBySnapToItemAlign: (id: Id | null) => void;

    update: (immediately?: boolean) => void;

    scrollToLeft: (options?: IScrollOptions) => void;

    scrollToRight: (options?: IScrollOptions) => void;

    scrollToTop: (options?: IScrollOptions) => void;

    scrollToBottom: (options?: IScrollOptions) => void;
}