import { Observable } from "rxjs";
import { TrackBox } from "../core/track-box";
import { IRenderVirtualListItem, IVirtualListCollection, IVirtualListItem, IVirtualListItemConfigMap } from "../models";
import { SelectingModesTypes } from "../enums/selecting-modes-types";
import { FocusItemParams } from "../types/focus-item-params";
import { IRenderVirtualListCollection } from "../models/render-collection.model";
import { FocusAlignment } from "../types";
import { IScrollToParams } from "./scroll-to-params";
import { IAnimationParams } from "./animation-params";
import { Id, IRect, ISize, TextDirection } from "../../common";
import { IScrollOptions } from "./scroll-options";
import { IBaseScrollViewService } from "../../common/interfaces/base-scroll-view-service";
import { INtScroller } from "../../common/interfaces/nt-scroller";

/**
 * INtListService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/nt-list/interfaces/nt-list-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtListService extends IBaseScrollViewService {
    readonly $virtualClick: Observable<IRenderVirtualListItem<any> | null>;

    readonly $selectedIds: Observable<Array<Id> | Id | null>;

    readonly $collapsedIds: Observable<Array<Id>>;

    readonly $selectingMode: Observable<SelectingModesTypes>;

    set selectingMode(v: SelectingModesTypes);

    readonly $focusedId: Observable<Id | null>;

    set focusedId(v: Id | null);

    get focusedId(): Id | null;

    readonly $focusItem: Observable<FocusItemParams>;

    readonly $scrollTo: Observable<IScrollToParams | undefined>;

    readonly $scrollToStart: Observable<IScrollOptions | undefined>;

    readonly $scrollToEnd: Observable<IScrollOptions | undefined>;

    readonly $tick: Observable<void>;

    readonly $cacheVersion: Observable<number>;

    animationParams: IAnimationParams;

    trackBy: string;

    lastFocusedItemId: number;

    scrollStartOffset: number;

    scrollEndOffset: number;

    zIndexWhenSelecting: string | null;

    selectByClick: boolean;

    collapseByClick: boolean;

    defaultItemValue: IVirtualListItem | null;

    isVertical?: boolean;

    itemSize: number;

    snapScrollToStart: boolean;

    snapScrollToEnd: boolean;

    isNoneCollapse: boolean;

    isMultipleCollapse: boolean;

    isAccordionCollapse: boolean;

    isInfinity: boolean;

    scrollBarSize: number;

    dynamic: boolean;

    snapToItem: boolean;

    listElement: HTMLDivElement | null;

    items: IVirtualListCollection;

    itemConfigMap: IVirtualListItemConfigMap;

    readonly $scrollBarSize: Observable<number>;

    readonly $displayItems: Observable<IRenderVirtualListCollection>;
    get displayItems(): IRenderVirtualListCollection;

    set collection(v: IRenderVirtualListCollection);
    get collection(): IRenderVirtualListCollection;

    readonly $langTextDir: Observable<TextDirection>;
    get langTextDir(): TextDirection;
    set langTextDir(v: TextDirection);

    readonly $grabbing: Observable<boolean>;
    get grabbing(): boolean;
    set grabbing(v: boolean);

    readonly $clickPressed: Observable<boolean>;
    get clickPressed(): boolean;
    set clickPressed(v: boolean);

    readonly $isGrabbing: Observable<boolean>;
    get isGrabbing(): boolean;

    readonly $intersectionElementBySnapToItemAlign: Observable<Id | null>;

    readonly $clickDistance: Observable<number>;
    get clickDistance(): number;
    set clickDistance(v: number);

    set selectedIds(ids: Array<Id> | Id | null);
    get selectedIds(): Array<Id> | Id | null;

    set collapsedIds(ids: Array<Id>);

    get collapsedIds(): Array<Id>;

    update(immediately?: boolean): void;

    initialize(id: number, component: INtScroller<IBaseScrollViewService>, parent: IBaseScrollViewService, trackBox: TrackBox): void;

    generateComponentId(): number;

    create(_trackBox: TrackBox): void;

    virtualClick(data: IRenderVirtualListItem | null): void;

    select(id: Id, selected?: boolean): void;

    collapse(id: Id, collapsed?: boolean): void;

    getItemBounds(id: Id): ISize | null;

    focusById(id: Id, align?: FocusAlignment, scrollBehavior?: ScrollBehavior): void;

    focus(element: HTMLElement, align?: FocusAlignment, behavior?: ScrollBehavior): boolean;

    focusList(): void;

    focusFirstElement(): void;

    getFocusedElementById(id: Id): HTMLDivElement | null;

    getItemBounds(id: Id): ISize | null;

    getComponentBoundsByIntersectionPosition(position: number, maxPosition?: number | null):
        (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; }) | null;

    setIntersectionElementBySnapToItemAlign(id: Id | null): void;

    scrollTo(id: Id, cb?: (() => void) | null, options?: IScrollOptions | null): void;

    scrollToStart(options?: IScrollOptions): void;

    scrollToEnd(options?: IScrollOptions): void;
}