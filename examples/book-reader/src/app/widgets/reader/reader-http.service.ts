import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Id } from 'centrifugal';
import { IBookChunkParams, ReaderService } from './reader.service';
import { IGetBookData } from './model/book';

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

  getPages(chatId: Id, chunk?: IBookChunkParams): Observable<IGetBookData> {
    throw new Error('Method not implemented.');
  }
}
