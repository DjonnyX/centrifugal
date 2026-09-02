import { Injectable } from '@angular/core';
import { delay, Observable, of, switchMap, throwError } from 'rxjs';
import { generateMessageCollection } from '@mock/const/collection';
import { Id, IVirtualListCollection } from 'centrifugal';
import { IBookChunkParams, SwipeImageService } from './swipe-image.service';
import { IGetImagesAnswer, IGetSwipeImageData } from './model/images';
import { ISwipeImage } from './model/swipe-image';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
interface IDB {
    version: number;
    books: {
        [groupId: string]: {
            version: number;
            pages?: IVirtualListCollection<ISwipeImage>;
        }
    };
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const db: IDB = {
    version: 0,
    books: {},
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
const sortByDateTime = (a: ISwipeImage, b: ISwipeImage) => {
    if (a.id > b.id) {
        return 1;
    }
    if (a.id < b.id) {
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
export class SwipeImageMockService extends SwipeImageService {
    clear(groupId: Id) {
        if (!db.books[groupId]) {
            return;
        }
        db.books[groupId].pages = [];
        this._$groupId.next(groupId);
    }

    getImages(groupId: Id, chunk?: IBookChunkParams): Observable<IGetSwipeImageData> {
        operations.groupId = groupId;

        if (!db.books[groupId]) {
            db.books[groupId] = {
                version: 0,
            };
        }
        if (!Array.isArray(db.books[groupId].pages)) {
            db.books[groupId].pages = [];
        }
        const number = chunk?.number ?? DEFAULT_CHUNK_NUMBER, size = chunk?.size ?? DEFAULT_CHUNK_SIZE,
            pages: IVirtualListCollection<ISwipeImage> = [];

        let listChunk: IVirtualListCollection<ISwipeImage>;
        if (chunk) {
            listChunk = generateMessageCollection(number, size);
            if (number === 1) {
                db.books[groupId].pages = [...listChunk];
            } else {
                db.books[groupId].pages.push(...listChunk);
            }
            db.books[groupId].pages = db.books[groupId].pages.sort(sortByDateTime);
        } else {
            listChunk = [];
            const dbPages = db.books[groupId].pages;
            let num = 1, chunkSize = Math.min(db.books[groupId].pages.length, size);
            while (num <= chunkSize && dbPages.length - num > -1) {
                const i = dbPages.length - num, message = dbPages[i];
                if ((message as any).__deleted__) {
                    chunkSize++;
                } else {
                    listChunk.push(message);
                }
                num++;
            }
        }
        for (let i = 0, l = Math.min(db.books[groupId].pages.length, size); i < l; i++) {
            const msg = listChunk[i];
            pages.push(msg);
        }
        const result: IGetImagesAnswer = {
            data: {
                version: db.books[groupId].version,
                pages,
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
