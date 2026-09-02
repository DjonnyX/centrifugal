import { MediaSizes } from "../enums";
import { MediaSize } from "../types";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IMediaParams {
    [size: MediaSizes | string]: MediaSize | number;
}