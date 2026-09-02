import { Injectable } from '@angular/core';
import { delay, Observable, of, switchMap, throwError } from 'rxjs';
import { generateMessageCollection } from '@mock/const/collection';
import { Id, IVirtualListCollection } from 'centrifugal';
import { IStoreItemsChunkParams, StoreItemsService } from './store-items.service';
import { IGetItemsAnswer, IGetItemsData } from './model/items';
import { IStoreItem } from './model/store-item';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
interface IDB {
    version: number;
    groups: {
        [groupId: string]: {
            version: number;
            messages?: IVirtualListCollection<IStoreItem>;
        }
    };
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const db: IDB = {
    version: 0,
    groups: {},
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const operations: {
    groupId: Id | null;
} = {
    groupId: null,
};

const DEFAULT_CHUNK_NUMBER = 1,
    DEFAULT_CHUNK_SIZE = 100;


/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
const sortByDateTime = (a: IStoreItem, b: IStoreItem) => {
    if (a.dateTime > b.dateTime) {
        return 1;
    }
    if (a.dateTime < b.dateTime) {
        return -1;
    }
    return 0;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
    providedIn: 'root'
})
export class StoreItemsMockService implements StoreItemsService {
    constructor() { }

    getPosts(groupId: Id, chunk?: IStoreItemsChunkParams): Observable<IGetItemsData> {
        operations.groupId = groupId;

        if (!db.groups[groupId]) {
            db.groups[groupId] = {
                version: 0,
            };
        }
        if (!Array.isArray(db.groups[groupId].messages)) {
            db.groups[groupId].messages = [];
        }
        const number = chunk?.number ?? DEFAULT_CHUNK_NUMBER, size = chunk?.size ?? DEFAULT_CHUNK_SIZE,
            items: IVirtualListCollection<IStoreItem> = [];

        let listChunk: IVirtualListCollection<IStoreItem>;
        if (chunk) {
            listChunk = generateMessageCollection(number, size);
            if (number === 1) {
                db.groups[groupId].messages = [...listChunk];
            } else {
                db.groups[groupId].messages.push(...listChunk);
            }
            db.groups[groupId].messages = db.groups[groupId].messages.sort(sortByDateTime);
        } else {
            listChunk = [];
            const dbMessages = db.groups[groupId].messages;
            let num = 1, chunkSize = Math.min(db.groups[groupId].messages.length, size);
            while (num <= chunkSize && dbMessages.length - num > -1) {
                const i = dbMessages.length - num, message = dbMessages[i];
                if ((message as any).__deleted__) {
                    chunkSize++;
                } else {
                    listChunk.push(message);
                }
                num++;
            }
        }
        for (let i = 0, l = Math.min(db.groups[groupId].messages.length, size); i < l; i++) {
            const msg = listChunk[i];
            items.push(msg);
        }
        const result: IGetItemsAnswer = {
            data: {
                version: db.groups[groupId].version,
                items,
            },
        };
        return of(result).pipe(
            delay(0),
            switchMap(res => {
                if (res.error) {
                    return throwError(() => {
                        return `Get message chunk error: ${res.error}`;
                    });
                }
                if (!res.data) {
                    return throwError(() => {
                        return `Error in receiving data.`;
                    });
                }
                return of(res.data);
            }),
        );
    }
}
