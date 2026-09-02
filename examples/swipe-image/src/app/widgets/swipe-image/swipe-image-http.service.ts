import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Id } from 'centrifugal';
import { IBookChunkParams, SwipeImageService } from './swipe-image.service';
import { IGetSwipeImageData } from './model/images';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
  providedIn: 'root'
})
export class SwipeImageHttpService extends SwipeImageService {
  clear(groupId: Id) {
    throw new Error('Method not implemented.');
  }

  getImages(chatId: Id, chunk?: IBookChunkParams): Observable<IGetSwipeImageData> {
    throw new Error('Method not implemented.');
  }
}
