import { InjectionToken } from "@angular/core";
import { IScrollViewService } from "../../scroll-view";
import { IControlContainerService } from "../../control-container/interfaces";

export const SCROLL_VIEW_INVERSION = new InjectionToken<boolean>('ScrollViewInversion');

export const SCROLL_VIEW_OVERSCROLL_ENABLED = new InjectionToken<boolean>('ScrollViewOverscrollEnabled');

export const SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO = new InjectionToken<boolean>('ScrollViewNormalizeValueFromZero');

export const SCROLL_VIEW_SERVICE = new InjectionToken<IScrollViewService>('ScrollViewService');

export const CONTROL_CONTAINER_SERVICE = new InjectionToken<IControlContainerService | null>('ControlContainerService');