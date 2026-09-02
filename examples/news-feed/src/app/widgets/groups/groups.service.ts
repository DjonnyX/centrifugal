import { Observable } from "rxjs";
import { Id, IVirtualListCollection } from 'centrifugal';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export abstract class GroupsService {
    abstract getGroups(projectId: string): Observable<IVirtualListCollection<any>>;

    abstract createGroup(group: any): Observable<any>;

    abstract updateGroup(group: any): Observable<any>;

    abstract deleteGroup(groupId: Id): Observable<void>;
}