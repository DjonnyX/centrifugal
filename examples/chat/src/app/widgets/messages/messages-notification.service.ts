import { Observable } from "rxjs";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export abstract class MessagesNotificationService {
    /**
     * version
     */
    abstract $messages: Observable<number>;

    /**
     * userId
     */
    abstract $typing: Observable<number>;
}