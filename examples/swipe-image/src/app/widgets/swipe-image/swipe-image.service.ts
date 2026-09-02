import { BehaviorSubject, Observable } from "rxjs";
import { Id, NtListComponent } from 'centrifugal';
import { IGetSwipeImageData } from "./model/images";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IBookChunkParams {
    number?: number;
    size?: number;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export abstract class SwipeImageService {
    virtualList: NtListComponent | null = null;

    protected _$groupId = new BehaviorSubject<Id>(0);
    readonly $groupId = this._$groupId.asObservable();

    abstract getImages(chatId: Id, chunk?: IBookChunkParams): Observable<IGetSwipeImageData>;

    abstract clear(groupId: Id): void
}