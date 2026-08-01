import { X_PROP_NAME, Y_PROP_NAME } from "../const/base-prop-names";
import { ScrollerTypes } from "../enums/scroller-types";
import { INtBaseScrollViewService } from "../interfaces/nt-base-scroll-view-service"

/**
 * getScrollable
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/utils/get-scrollable.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const getScrollable = (service: INtBaseScrollViewService, axis: typeof X_PROP_NAME | typeof Y_PROP_NAME, parent: boolean = false) => {
    const scrollView = !!parent ? (service?.parent?.scrollView as any) : (service?.scrollView as any);
    return scrollView?.type === ScrollerTypes.LIST_SCROLLER ? (scrollView?.scrollable) ?? true : (axis === X_PROP_NAME ? scrollView?.scrollableX : scrollView?.scrollableY) ?? true;
}