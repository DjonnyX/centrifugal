import { Color } from "@shared/types";

interface IOnlineStoreGroupState {
    fill: Color;
    color: Color;
    iconColor: Color;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IOnlineStoreGroupsTheme {
    group: {
        background: Color;
        normal: IOnlineStoreGroupState;
        focused: IOnlineStoreGroupState;
        selected: IOnlineStoreGroupState;
        selectedFocused: IOnlineStoreGroupState;
    };
}