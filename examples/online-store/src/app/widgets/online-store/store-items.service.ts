import { Observable } from "rxjs";
import { Id } from 'centrifugal';
import { IGetItemsData } from "./model/items";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IStoreItemsChunkParams {
    number?: number;
    size?: number;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export abstract class StoreItemsService {
    abstract getPosts(groupId: Id, chunk?: IStoreItemsChunkParams): Observable<IGetItemsData>;
}