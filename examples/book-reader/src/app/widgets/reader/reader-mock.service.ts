import { Injectable } from '@angular/core';
import { delay, Observable, of, switchMap, throwError } from 'rxjs';
import { generateMessageCollection } from '@mock/const/collection';
import { Id, IVirtualListCollection } from 'centrifugal';
import { IBookChunkParams, ReaderService } from './reader.service';
import { IGetBookPagesAnswer, IGetBookData } from './model/book';
import { IBookPage } from './model/book-page';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
interface IDB {
    version: number;
    books: {
        [bookId: string]: {
            version: number;
            pages?: IVirtualListCollection<IBookPage>;
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
    bookId: Id | null;
} = {
    bookId: null,
};

const DEFAULT_CHUNK_NUMBER = 1,
    DEFAULT_CHUNK_SIZE = 100;


/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
const sortByDateTime = (a: IBookPage, b: IBookPage) => {
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
export class ReaderMockService extends ReaderService {
    clear(bookId: Id) {
        if (!db.books[bookId]) {
            return;
        }
        db.books[bookId].pages = [];
        this._$bookId.next(bookId);
    }

    getPages(bookId: Id, chunk?: IBookChunkParams): Observable<IGetBookData> {
        operations.bookId = bookId;

        if (!db.books[bookId]) {
            db.books[bookId] = {
                version: 0,
            };
        }
        if (!Array.isArray(db.books[bookId].pages)) {
            db.books[bookId].pages = [];
        }
        const number = chunk?.number ?? DEFAULT_CHUNK_NUMBER, size = chunk?.size ?? DEFAULT_CHUNK_SIZE,
            pages: IVirtualListCollection<IBookPage> = [];

        let listChunk: IVirtualListCollection<IBookPage>;
        if (chunk) {
            listChunk = generateMessageCollection(number, size);
            if (number === 1) {
                db.books[bookId].pages = [...listChunk];
            } else {
                db.books[bookId].pages.push(...listChunk);
            }
            db.books[bookId].pages = db.books[bookId].pages.sort(sortByDateTime);
        } else {
            listChunk = [];
            const dbPages = db.books[bookId].pages;
            let num = 1, chunkSize = Math.min(db.books[bookId].pages.length, size);
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
        for (let i = 0, l = Math.min(db.books[bookId].pages.length, size); i < l; i++) {
            const msg = listChunk[i];
            pages.push(msg);
        }
        const result: IGetBookPagesAnswer = {
            data: {
                version: db.books[bookId].version,
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
