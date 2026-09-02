import { Color } from "@shared/types";

interface IFileViewerGroupState {
    fill: Color;
    color: Color;
    iconColor: Color;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IFileViewerGroupsTheme {
    group: {
        background: Color;
        normal: IFileViewerGroupState;
        focused: IFileViewerGroupState;
        selected: IFileViewerGroupState;
        selectedFocused: IFileViewerGroupState;
    };
}