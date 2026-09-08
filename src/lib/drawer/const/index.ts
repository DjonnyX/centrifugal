import { ArithmeticExpression } from "../../common";
import { INtDrawerAnimationParams } from "../interfaces";

export const DEFAULT_DOCK_SIZE: ArithmeticExpression = 0;

export const DEFAULT_BACKDROP: boolean = true;

export const MIN_TRACE_VALUE = 0.0001;

export const MAX_TRACE_VALUE = 0.0002;

export const DEFAULT_ANIMATION_PARAMS: INtDrawerAnimationParams = {
    scrollToItem: 500,
    snapToItem: 500,
};
