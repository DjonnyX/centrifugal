import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Subject } from 'rxjs';
import { IMessageItemData } from '@shared/models/message';
import { NtListComponent } from 'centrifugal';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _virtualList: NtListComponent | undefined;
  set virtualList(v: NtListComponent | undefined) {
    if (this._virtualList !== v) {
      this._virtualList = v;
    }
  }

  private _$add = new Subject<IMessageItemData>();
  readonly $add = this._$add.asObservable();

  private _$chatId = new BehaviorSubject<string | null>(null);
  readonly $chatId = this._$chatId.asObservable().pipe(
    distinctUntilChanged(),
  );
  get chatId() {
    return this._$chatId.getValue();
  }

  constructor() { }

  add(msg: IMessageItemData) {
    this._$add.next(msg);
  }

  changeChat(chatId: string) {
    this._$chatId.next(chatId);
  }

  stopSnappingScrollToEnd() {
    if (this._virtualList) {
      // this._virtualList.stopSnappingScrollToEnd();
    }
  }
}
