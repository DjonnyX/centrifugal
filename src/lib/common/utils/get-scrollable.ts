import { X_PROP_NAME, Y_PROP_NAME } from "../const/base-prop-names";
import { ScrollerTypes } from "../enums/scroller-types";
import { IBaseScrollViewService } from "../interfaces/base-scroll-view-service"

export const getScrollable = (service: IBaseScrollViewService, axis: typeof X_PROP_NAME | typeof Y_PROP_NAME, parent: boolean = false) => {
    const scrollView = !!parent ? (service?.parent?.scrollView as any) : (service?.scrollView as any);
    return scrollView?.type === ScrollerTypes.LIST_SCROLLER ? (scrollView?.scrollable) ?? true : (axis === X_PROP_NAME ? scrollView?.scrollableX : scrollView?.scrollableY) ?? true;
}