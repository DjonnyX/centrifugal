import { InjectionToken } from "@angular/core";
import { INtControlContainerService } from "../../control-container/interfaces";
import { INtBaseScrollViewService } from "../interfaces/nt-base-scroll-view-service";
import { INtOverscrollService } from "../interfaces/nt-overscroll-service";

export const SCROLL_VIEW_TYPE = new InjectionToken<string>('ScrollViewType');

export const SCROLL_VIEW_INVERSION = new InjectionToken<boolean>('ScrollViewInversion');

export const SCROLL_VIEW_OVERSCROLL_ENABLED = new InjectionToken<boolean>('ScrollViewOverscrollEnabled');

export const SCROLL_VIEW_USER_INTERACTION_ENABLED = new InjectionToken<boolean>('ScrollViewUserInteractionEnabled');

export const SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO = new InjectionToken<boolean>('ScrollViewNormalizeValueFromZero');

export const SCROLL_VIEW_AXLE_LOCK = new InjectionToken<boolean>('ScrollViewAxleLock');

export const SCROLL_VIEW_SERVICE = new InjectionToken<INtBaseScrollViewService>('ScrollViewService');

export const OVERSCROLL_SERVICE = new InjectionToken<INtOverscrollService | null>('OverscrollService');

export const CONTROL_CONTAINER_SERVICE = new InjectionToken<INtControlContainerService | null>('ControlContainerService');