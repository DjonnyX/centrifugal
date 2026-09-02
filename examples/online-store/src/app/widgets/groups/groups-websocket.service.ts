import { Injectable } from '@angular/core';
import { GroupsService } from './groups.service';
import { Id, IVirtualListCollection } from 'centrifugal';
import { Observable } from 'rxjs';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
  providedIn: 'root'
})
export class GroupsWebsocketService implements GroupsService {
  constructor() { }

  getGroups(projectId: string): Observable<IVirtualListCollection<any>> {
    throw new Error('Method not implemented.');
  }

  createGroup(group: any): Observable<any> {
    throw new Error('Method not implemented.');
  }

  updateGroup(group: any): Observable<any> {
    throw new Error('Method not implemented.');
  }

  deleteGroup(groupId: Id): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
