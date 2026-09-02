import { Color } from "@shared/types";

interface IChatGroupState {
    fill: Color;
    color: Color;
    iconColor: Color;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IChatsTheme {
    group: {
        background: Color;
        normal: IChatGroupState;
        focused: IChatGroupState;
        selected: IChatGroupState;
        selectedFocused: IChatGroupState;
    };
}