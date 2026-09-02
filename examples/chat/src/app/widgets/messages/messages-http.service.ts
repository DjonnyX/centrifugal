import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMessageItemData } from '@shared/models/message';
import { IMessagesChunkParams, MessagesService } from './messages.service';
import { IGetMessagesData } from './model/messages';
import { IMessage } from './model/message';
import { Id, IVirtualListCollection, IVirtualListItem } from 'centrifugal';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
  providedIn: 'root'
})
export class MessagesHttpService implements MessagesService {
  constructor() { }

  getMessages(chatId: Id, chunk?: IMessagesChunkParams): Observable<IGetMessagesData> {
    throw new Error('Method not implemented.');
  }

  createMessage(chatId: Id, message: Omit<IVirtualListItem<IMessageItemData>, 'id' | 'mailed' | 'edited' | 'incomType' | 'type' | 'dateTime'>): Observable<IVirtualListItem<IMessage>> {
    throw new Error('Method not implemented.');
  }

  updateMessage(chatId: Id, messageId: Id, message: Partial<Omit<IVirtualListItem<IMessageItemData>, 'id'>>): Observable<IVirtualListItem<IMessage>> {
    throw new Error('Method not implemented.');
  }

  patchMessages(chatId: Id, messages: IVirtualListCollection<Partial<IVirtualListItem<IMessageItemData>>>): Observable<IGetMessagesData> {
    throw new Error('Method not implemented.');
  }

  deleteMessage(chatId: Id, messageId: Id, params: { deleteAll: boolean; }): Observable<number | undefined> {
    throw new Error('Method not implemented.');
  }
}
