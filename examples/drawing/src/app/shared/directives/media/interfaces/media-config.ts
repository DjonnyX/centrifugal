import { MediaScreenSize } from "../types";
import { DeviceType } from "../types";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IMediaConfig {
    [size: DeviceType | MediaScreenSize | string]: number;
}