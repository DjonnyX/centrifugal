import { MessageButtonSendStates } from "../enums";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export type MessageButtonSendState = MessageButtonSendStates.CANCEL | MessageButtonSendStates.SEND | 'cancel' | 'send';
