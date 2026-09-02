import { IPostItemData } from "@shared/models/message";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IPost extends IPostItemData {
    __deleted__?: boolean;
    version: number;
}
