import { KeyboardKeys, KeyboardPositions } from "../enums";
import { IKeyboardSettings } from "../interfaces";
import { IKeyboardPreset } from "../interfaces/keyboard-preset";

export const DEFAULT_KEYBOARD_LOCALE: string = 'en-gb';

export const DEFAULT_KEYBOARD_POSITION = KeyboardPositions.BOTTOM;

export const DEFAULT_KEYBOARD_VERTICAL_PRESET: Array<IKeyboardPreset> = [
    {
        locale: DEFAULT_KEYBOARD_LOCALE,
        charset: [
            {
                name: 'text',
                type: 'text',
                keys: [
                    ['A', 'B', 'C', 'D'],
                    ['E', 'F', 'G', 'H'],
                    ['I', 'J', 'K', 'L'],
                    ['M', 'N', 'O', 'P'],
                    ['Q', 'R', 'S', 'T'],
                    ['U', 'X', 'V', 'W'],
                    [{ class: 'secondary', value: KeyboardKeys.SHIFT }, 'Y', 'Z', { class: 'secondary', value: KeyboardKeys.BACK_SPACE }],
                    [{ style: 'flex: 2;', value: KeyboardKeys.SPACE }],
                    [null],
                    ['7', '8', '9', '-'],
                    ['4', '5', '6', '+'],
                    ['1', '2', '3', '.'],
                    [{ class: 'secondary', value: '=' }, '0', { class: 'secondary', style: 'flex: 2', value: KeyboardKeys.ENTER }],
                    [{ class: 'secondary', style: 'flex: 1;', value: 'charset::numeric' }, { class: 'secondary', style: 'flex: 1;', value: KeyboardKeys.SYS_NEXT_LOCALE }],
                    [null],
                    ['@', '#', '$', '_'],
                    ['&', '\\', '(', ')'],
                    ['\\', '*','^', '/'],
                    ['~', '`', '|', '/'],
                    ['%', '×', '[', ']'],
                    ['÷', '·', '<', '>']
                ],
            },
        ],
    },
];

export const DEFAULT_KEYBOARD_HORIZONTAL_PRESET: Array<IKeyboardPreset> = [
    {
        locale: DEFAULT_KEYBOARD_LOCALE,
        charset: [
            {
                name: 'text',
                type: 'text',
                keys: [
                    [{ class: 'empty', style: 'flex: 0.5', value: null }, 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', { class: 'empty', style: 'flex: 0.5', value: null }],
                    [{ class: 'empty', value: null }, 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', { class: 'empty', value: null }],
                    [{ class: 'secondary', value: KeyboardKeys.SHIFT }, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'I', 'O', 'P', { class: 'secondary', value: KeyboardKeys.BACK_SPACE }],
                    [{ class: 'secondary', value: 'charset::numeric' }, { class: 'secondary', value: '/' }, KeyboardKeys.SYS_NEXT_LOCALE, { style: 'flex: 6', value: KeyboardKeys.SPACE }, { class: 'secondary', value: '.' }, { class: 'secondary', value: KeyboardKeys.ENTER }],
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
];


export const DEFAULT_KEYBOARD_SETTINGS: IKeyboardSettings = {
    common: {
        focusedTargetOffset: 20,
        position: DEFAULT_KEYBOARD_POSITION,
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
    preset: DEFAULT_KEYBOARD_HORIZONTAL_PRESET,
};