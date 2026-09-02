import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Id } from 'centrifugal';
import { IPostsChunkParams, PostsService } from './posts.service';
import { IGetPostsData } from './model/posts';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
  providedIn: 'root'
})
export class PostsHttpService implements PostsService {
  constructor() { }

  getPosts(groupId: Id, chunk?: IPostsChunkParams): Observable<IGetPostsData> {
    throw new Error('Method not implemented.');
  }
}
