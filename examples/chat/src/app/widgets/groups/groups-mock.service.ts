import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { generateChatCollection } from '@mock/const';
import { GroupsService } from './groups.service';
import { Id, IVirtualListCollection } from 'centrifugal';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
interface IDB {
    version: number;
    chats: IVirtualListCollection<any>;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
    providedIn: 'root'
})
export class GroupsMockService implements GroupsService {
    private _db: IDB;

    constructor() {
        this._db = {
            version: 0,
            chats: generateChatCollection(),
        }
    }

    getGroups(projectId: string): Observable<IVirtualListCollection<any>> {
        const data = this._db.chats;

        return of(data).pipe(
            delay(10 + (Math.random() * 500)),
        );
    }
    createGroup(group: any): Observable<any> {
        throw new Error('Method not implemented.');
    }

    updateGroup(group: any): Observable<any> {
        throw new Error('Method not implemented.');
    }

    deleteGroup(groupId: Id): Observable<void> {
        const data = this._db.chats;

        const index = data.findIndex(({ id }) => id == groupId);
        if (index > -1) {
            data.splice(index, 1);
            return of(undefined).pipe(
                delay(10 + (Math.random() * 1000)),
            );
        }
        return throwError(() => {
            return `Group by id is not found.`;
        });
    }
}
