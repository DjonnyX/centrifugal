import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { NtListComponent } from '@shared/components';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private _virtualList: NtListComponent | undefined;
  set virtualList(v: NtListComponent | undefined) {
    if (this._virtualList !== v) {
      this._virtualList = v;
    }
  }

  private _$groupId = new BehaviorSubject<string | null>(null);
  readonly $groupId = this._$groupId.asObservable().pipe(
    distinctUntilChanged(),
  );
  get groupId() {
    return this._$groupId.getValue();
  }

  constructor() { }

  changeChat(groupId: string) {
    this._$groupId.next(groupId);
  }
}
