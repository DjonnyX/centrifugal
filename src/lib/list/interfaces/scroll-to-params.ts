import { Id } from "../../common";
import { IScrollOptions } from "./scroll-options";

export interface IScrollToParams {
    id: Id;
    cb: (() => void) | null;
    options: IScrollOptions | null;
  }