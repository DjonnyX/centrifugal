import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Id } from 'centrifugal';
import { IStoreItemsChunkParams, StoreItemsService } from './store-items.service';
import { IGetItemsData } from './model/items';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
  providedIn: 'root'
})
export class StoreItemsHttpService implements StoreItemsService {
  constructor() { }

  getPosts(groupId: Id, chunk?: IStoreItemsChunkParams): Observable<IGetItemsData> {
    throw new Error('Method not implemented.');
  }
}
