import { IVirtualListCollection } from "centrifugal";
import { IAnswer } from "./answer";
import { IMessage } from "./message";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IGetMessagesData {
    version: number;
    items: IVirtualListCollection<IMessage>;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IGetMessagesAnswer extends IAnswer<IGetMessagesData> { }
