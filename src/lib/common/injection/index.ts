import { InjectionToken } from "@angular/core";
import { INtScrollViewService } from "../../scroll-view";
import { INtControlContainerService } from "../../control-container/interfaces";

export const SCROLL_VIEW_INVERSION = new InjectionToken<boolean>('ScrollViewInversion');

export const SCROLL_VIEW_OVERSCROLL_ENABLED = new InjectionToken<boolean>('ScrollViewOverscrollEnabled');

export const SCROLL_VIEW_USER_INTERACTION_ENABLED = new InjectionToken<boolean>('ScrollViewUserInteractionEnabled');

export const SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO = new InjectionToken<boolean>('ScrollViewNormalizeValueFromZero');

export const SCROLL_VIEW_SERVICE = new InjectionToken<INtScrollViewService>('ScrollViewService');

export const CONTROL_CONTAINER_SERVICE = new InjectionToken<INtControlContainerService | null>('ControlContainerService');