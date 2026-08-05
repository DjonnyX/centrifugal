import { IKeyboardSettings, KeyboardPositions } from "../../common";
import { KeyboardKeys } from "../../common/enums/keyboard-keys";

export const DEFAULT_KEYBOARD_ENABLED: boolean = true;

export const DEFAULT_KEYBOARD_SETTINGS: IKeyboardSettings = {
    common: {
        focusedTargetOffset: 20,
        position: KeyboardPositions.BOTTOM,
        scrollerOffsetWhenFocused: .9,
        size: 200,
    },
    animation: {
        transition: {
            in: 250,
            out: 250,
            focusedScroller: 200,
        },
    },
    preset: [
        {
            locale: 'en-gb',
            charset: [
                {
                    name: 'text',
                    type: 'text',
                    keys: [
                        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                        [{ class: 'empty', value: null }, 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', { class: 'empty', value: null }],
                        [{ class: 'secondary', value: KeyboardKeys.SHIFT }, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'I', 'O', 'P', { class: 'secondary', value: KeyboardKeys.BACK_SPACE }],
                        [{ class: 'secondary', value: 'charset::numeric' }, { class: 'secondary', value: '/' }, KeyboardKeys.SYS_NEXT_LOCALE, KeyboardKeys.SPACE, { class: 'secondary', value: '.' }, { class: 'secondary', value: KeyboardKeys.ENTER }],
                    ],
                },
                {
                    name: 'symbols',
                    type: 'text',
                    keys: [
                        ['~', '`', '|', '', '', '', '', '', '', ''],
                        ['', '', '', '', '^', '', '=', '{', '}', '\\'],
                        [{ class: 'secondary', value: 'charset::numeric-extend' }, '%', '', '', '', '', '[', ']', { class: 'secondary', value: KeyboardKeys.BACK_SPACE }],
                        [{ class: 'secondary', value: 'charset::text' }, { class: 'secondary', value: '<' }, 'charset::numeric', KeyboardKeys.SPACE, { class: 'secondary', value: '>' }, { class: 'secondary', value: KeyboardKeys.ENTER }],
                    ],
                },
                {
                    name: 'numeric',
                    type: 'number',
                    keys: [
                        [{ class: 'secondary', value: '+' }, '1', '2', '3', { class: 'secondary', value: '%' }],
                        [{ class: 'secondary', value: '-' }, '4', '5', '6', { class: 'secondary', value: KeyboardKeys.SPACE }],
                        [{ class: 'secondary', value: '*' }, '7', '8', '9', { class: 'secondary', value: KeyboardKeys.BACK_SPACE }],
                        [{ class: 'secondary', value: 'charset::text' }, { class: 'secondary', value: ',' }, 'charset::numeric-extend', '0', '=', { class: 'secondary', value: '.' }, { class: 'secondary', value: KeyboardKeys.ENTER }],
                    ],
                },
                {
                    name: 'numeric-extend',
                    type: 'number',
                    keys: [
                        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
                        ['@', '#', '$', '_', '&', '-', '+', '(', ')', '/'],
                        [{ class: 'secondary', value: 'charset::symbols' }, '*', '"', '\'', ':', ';', '!', '?', { class: 'secondary', value: KeyboardKeys.BACK_SPACE }],
                        [{ class: 'secondary', value: 'charset::text' }, { class: 'secondary', value: ',' }, 'charset::numeric', KeyboardKeys.SPACE, { class: 'secondary', value: '.' }, { class: 'secondary', value: KeyboardKeys.ENTER }],
                    ],
                },
            ],
        },
    ],
};