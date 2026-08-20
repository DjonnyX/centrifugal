import { Observable } from "rxjs";
import { Id, TextDirection } from "../../common";
import { INtBaseScrollViewService } from "../../common/interfaces/nt-base-scroll-view-service";
import { INtScroller } from "../../common/interfaces/nt-scroller";
import { ISliderSteps } from "./slider-steps";

/**
 * INtSheetService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/sheet/interfaces/nt-slider-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtSliderService extends INtBaseScrollViewService {
    initialize: (id: number, component: INtScroller<INtBaseScrollViewService>, parentService: INtBaseScrollViewService | null) => void;

    steps: ISliderSteps | null;

    readonly $langTextDir: Observable<TextDirection>;

    get langTextDir(): TextDirection;

    set langTextDir(v: TextDirection);

    readonly $grabbing: Observable<boolean>;

    get grabbing(): boolean;

    set grabbing(v: boolean);

    readonly $tick: Observable<void>;

    readonly $intersectionElementBySnapToItemAlign: Observable<Id | null>;

    update: (immediately?: boolean) => void;
}
