import { Color } from "@shared/types";

interface INewsFeedGroupState {
    fill: Color;
    color: Color;
    iconColor: Color;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface INewsFeedGroupsTheme {
    group: {
        background: Color;
        normal: INewsFeedGroupState;
        focused: INewsFeedGroupState;
        selected: INewsFeedGroupState;
        selectedFocused: INewsFeedGroupState;
    };
}