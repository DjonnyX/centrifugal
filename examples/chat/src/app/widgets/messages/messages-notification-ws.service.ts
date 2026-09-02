import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MessagesNotificationService } from './messages-notification.service';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
  providedIn: 'root'
})
export class MessagesNotificationWSService implements MessagesNotificationService {
  /**
   * version
   */
  private _$messages = new Subject<number>;
  readonly $messages = this._$messages.asObservable();

  /**
   * userId
   */
  private _$typing = new Subject<number>;
  readonly $typing = this._$typing.asObservable();

  constructor() { }
}
