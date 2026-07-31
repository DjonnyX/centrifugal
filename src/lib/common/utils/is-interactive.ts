import { DEFAULT_INPUT_ELEMETNS } from "../directives/nt-virtual-click/const";

export const isInteractive = (tag: string): boolean => {
    return DEFAULT_INPUT_ELEMETNS.indexOf(tag) > -1;
}