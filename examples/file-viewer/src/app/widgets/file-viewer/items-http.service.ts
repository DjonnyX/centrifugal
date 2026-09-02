import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Id } from 'centrifugal';
import { IFileViewerItemsChunkParams, ItemsService } from './items.service';
import { IGetPostsData } from './model/posts';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
  providedIn: 'root'
})
export class ItemsHttpService implements ItemsService {
  constructor() { }

  getPosts(groupId: Id, chunk?: IFileViewerItemsChunkParams): Observable<IGetPostsData> {
    throw new Error('Method not implemented.');
  }
}
