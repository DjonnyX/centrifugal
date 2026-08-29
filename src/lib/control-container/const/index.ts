import { ElementNames } from "../../common";
import { ScrollerTypes } from "../../common/enums/scroller-types";

export const NT_VALUE = 'nt-value';

export const DEFAULT_KEYBOARD_ENABLED: boolean = true;

export const DEFAULT_EXCLUDE_ELEMETN_LIST: ElementNames = ['input', 'textarea'];

export const EXCLUDED_CONTAINERS = [ScrollerTypes.CONTROL_CONTAINER, ScrollerTypes.DRAWER];
