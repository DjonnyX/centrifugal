import { Observable } from "rxjs";
import { IMessageItemData } from "@shared/models/message";
import { IGetMessagesData } from "./model/messages";
import { IMessage } from "./model/message";
import { Id, IVirtualListCollection, IVirtualListItem } from "centrifugal";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IMessagesChunkParams {
    number?: number;
    size?: number;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export abstract class MessagesService {
    abstract getMessages(chatId: Id, chunk?: IMessagesChunkParams): Observable<IGetMessagesData>;

    abstract createMessage(chatId: Id, message: Omit<IVirtualListItem<IMessageItemData>, 'id' | 'mailed' | 'edited' | 'incomType' | 'type' | 'dateTime'>): Observable<IVirtualListItem<IMessage>>;

    abstract updateMessage(chatId: Id, messageId: Id, message: Partial<Omit<IVirtualListItem<IMessageItemData>, 'id'>>): Observable<IVirtualListItem<IMessage>>;

    abstract patchMessages(chatId: Id, messages: IVirtualListCollection<Partial<IVirtualListItem<IMessageItemData>>>): Observable<IGetMessagesData>;

    abstract deleteMessage(chatId: Id, messageId: Id, params: { deleteAll: boolean; }): Observable<number | undefined>;
}
