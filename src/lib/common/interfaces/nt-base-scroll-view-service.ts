import { Observable } from "rxjs";
import { TextDirection } from "../types/text-direction";

/**
 * INtBaseScrollViewService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/nt-base-scroll-view-service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface INtBaseScrollViewService {
    get id(): number;

    readonly $langTextDir: Observable<TextDirection>;

    get langTextDir(): TextDirection;

    set langTextDir(v: TextDirection);

    readonly $grabbing: Observable<boolean>;

    get grabbing(): boolean;

    set grabbing(v: boolean);
}