import { Observable } from "rxjs";
import { TextDirection } from "../types/text-direction";
import { IScrollable } from "./scrollable";
import { IOverscroll } from "./overscroll";
import { INtScroller } from "./nt-scroller";

/**
 * INtScrollViewService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/base-scroll-view-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IBaseScrollViewService {
    get id(): number;

    get parentId(): number;

    get parent(): IBaseScrollViewService;

    get scrollView(): INtScroller<IBaseScrollViewService>;

    readonly $langTextDir: Observable<TextDirection>;

    get langTextDir(): TextDirection;

    set langTextDir(v: TextDirection);

    readonly $clickDistance: Observable<number>;

    get clickDistance(): number;

    set clickDistance(v: number);

    readonly $grabbing: Observable<boolean>;

    get grabbing(): boolean;

    set grabbing(v: boolean);

    readonly $isGrabbing: Observable<boolean>;
    get isGrabbing(): boolean;

    readonly $scrollable: Observable<IScrollable>;

    get scrollable(): IScrollable;

    set scrollable(v: IScrollable);

    readonly $overscroll: Observable<IOverscroll>;

    get overscroll(): IOverscroll;

    set overscroll(v: IOverscroll);

    readonly $parentScrollable: Observable<IScrollable>;

    get parentScrollable(): IScrollable;

    set parentScrollable(v: IScrollable);

    readonly $parentOverscroll: Observable<IOverscroll>;

    get parentOverscroll(): IOverscroll;

    set parentOverscroll(v: IOverscroll);
}