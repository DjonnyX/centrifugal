import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Id } from 'centrifugal';
import { IBookChunkParams, ReaderService } from './reader.service';
import { IGetGalleryData } from './model/gallery';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
  providedIn: 'root'
})
export class ReaderHttpService extends ReaderService {
  clear(bookId: Id) {
    throw new Error('Method not implemented.');
  }

  getPages(chatId: Id, chunk?: IBookChunkParams): Observable<IGetGalleryData> {
    throw new Error('Method not implemented.');
  }
}
