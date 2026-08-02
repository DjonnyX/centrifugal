import { Observable } from "rxjs";
import { IAnimationParams } from "./animation-params";
import { Direction } from "../types";
import { IScrollOptions } from "./scroll-options";
import { Id, IRect, TextDirection } from "../../common";
import { INtBaseScrollViewService } from "../../common/interfaces/nt-base-scroll-view-service";
import { INtScroller } from "../../common/interfaces/nt-scroller";

/**
 * INtScrollViewService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/interfaces/nt-scroll-view-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtScrollViewService extends INtBaseScrollViewService {
    initialize: (id: number, component: INtScroller<INtBaseScrollViewService>, parentService: INtBaseScrollViewService | null) => void;

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

    readonly $langTextDir: Observable<TextDirection>;

    get langTextDir(): TextDirection;

    set langTextDir(v: TextDirection);

    readonly $grabbing: Observable<boolean>;

    get grabbing(): boolean;

    set grabbing(v: boolean);

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