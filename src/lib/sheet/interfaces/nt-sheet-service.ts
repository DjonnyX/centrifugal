import { Observable } from "rxjs";
import { IAnimationParams } from "./animation-params";
import { IScrollOptions, TextDirection } from "../../common";
import { INtBaseScrollViewService } from "../../common/interfaces/nt-base-scroll-view-service";
import { INtScroller } from "../../common/interfaces/nt-scroller";
import { Direction, SheetPosition } from "../types";
import { ISheetPrecalculatedBreakpoints } from '../interfaces';

/**
 * INtSheetService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/interfaces/nt-sheet-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtSheetService extends INtBaseScrollViewService {
    initialize: (id: number, component: INtScroller<INtBaseScrollViewService>, parentService: INtBaseScrollViewService | null) => void;

    animationParams: IAnimationParams;

    position: SheetPosition;

    scrollStartOffset: number;

    scrollEndOffset: number;

    direction: Direction;

    breakpoints: ISheetPrecalculatedBreakpoints | null;

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

    update: (immediately?: boolean) => void;

    scrollToLeft: (options?: IScrollOptions) => void;

    scrollToRight: (options?: IScrollOptions) => void;

    scrollToTop: (options?: IScrollOptions) => void;

    scrollToBottom: (options?: IScrollOptions) => void;
}