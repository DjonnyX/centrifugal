/**
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IMessageParams {
    reseted: boolean;
    isRTL: boolean;
    type: string | undefined;
    prevType: string | undefined;
    nextType: string | undefined;
    isIncoming: boolean;
    isOutgoing: boolean;
    prevIsIncoming: boolean;
    prevIsOutgoing: boolean;
    nextIsIncoming: boolean;
    nextIsOutgoing: boolean;
};
