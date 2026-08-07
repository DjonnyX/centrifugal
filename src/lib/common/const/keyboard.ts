import { KeyboardKeys, KeyboardPositions, TextDirections } from "../enums";
import { KeyboardIcons } from "../icons";
import { IKeyboardSettings } from "../interfaces";
import { IKeyboardPreset } from "../interfaces/keyboard-preset";
import { copyValueAsReadonly } from "../utils";

export const KEY_SYS = 'sys::';

export const KEY_CHARSET = 'charset::';

export const DEFAULT_KEYBOARD_LOCALE: string = 'en-gb';

export const DEFAULT_KEYBOARD_LANG_DIR: string = TextDirections.LTR;

export const DEFAULT_KEYBOARD_POSITION = KeyboardPositions.BOTTOM;

/**
 * DEFAULT_KEYBOARD_VERTICAL_PRESET
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/const/keyboard.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const DEFAULT_KEYBOARD_VERTICAL_PRESET: Array<IKeyboardPreset> = copyValueAsReadonly([
    {
        locale: DEFAULT_KEYBOARD_LOCALE,
        dir: 'ltr',
        charset: [
            {
                name: 'text',
                type: 'text',
                keys: [
                    ['7', '8', '9', '-'],
                    ['4', '5', '6', '+'],
                    ['1', '2', '3', '.'],
                    [{ class: 'secondary', value: '=' }, '0', { class: 'secondary', style: 'flex: 2', value: KeyboardKeys.ENTER, name: 'Enter' }],
                    [null],
                    ['A', 'B', 'C', 'D'],
                    ['E', 'F', 'G', 'H'],
                    ['I', 'J', 'K', 'L'],
                    ['M', 'N', 'O', 'P'],
                    ['Q', 'R', 'S', 'T'],
                    ['U', 'X', 'V', 'W'],
                    [{ class: 'secondary', value: KeyboardKeys.SHIFT, name: 'Shift' }, 'Y', 'Z', { class: 'secondary', value: KeyboardKeys.BACK_SPACE, icon: KeyboardIcons.BACKSPACE }],
                    [{ name: 'HE', value: KeyboardKeys.SYS_NEXT_LOCALE }, { style: 'flex: 3;', value: KeyboardKeys.SPACE, name: 'Space' }],
                    [null],
                    ['@', '#', '$', '_'],
                    ['&', '\\', '(', ')'],
                    ['\\', '*', '^', '/'],
                    ['~', '`', '|', '/'],
                    ['%', '×', '[', ']'],
                    ['÷', '·', '<', '>']
                ],
            },
        ],
    },
    {
        locale: 'he-Il',
        dir: 'rtl',
        charset: [
            {
                name: 'text',
                type: 'text',
                keys: [
                    ['7', '8', '9', '-'],
                    ['4', '5', '6', '+'],
                    ['1', '2', '3', '.'],
                    [{ class: 'secondary', value: '=' }, '0', { class: 'secondary', style: 'flex: 2', value: KeyboardKeys.ENTER, name: 'Enter' }],
                    [null],
                    ['ו', 'ן', 'ם', 'פ',],
                    ['ק', 'ר', 'א', 'ט',],
                    ['י', 'ח', 'ל', 'ך',],
                    ['ד', 'ג', 'כ', 'ע',],
                    ['מ', 'צ', 'ת', 'ש',],
                    ['ס', 'ב', 'ה', 'נ',],
                    [{ class: 'secondary', value: KeyboardKeys.SHIFT, name: 'Shift' }, 'ז', { style: 'flex: 2;', class: 'secondary', value: KeyboardKeys.BACK_SPACE, icon: KeyboardIcons.BACKSPACE }],
                    [{ name: 'EN', value: KeyboardKeys.SYS_NEXT_LOCALE }, { style: 'flex: 3;', value: KeyboardKeys.SPACE, name: 'Space' }],
                    [null],
                    ['@', '#', '$', '_'],
                    ['&', '\\', '(', ')'],
                    ['\\', '*', '^', '/'],
                    ['~', '`', '|', '/'],
                    ['%', '×', '[', ']'],
                    ['÷', '·', '<', '>']
                ],
            },
        ],
    },
]);

/**
 * DEFAULT_KEYBOARD_HORIZONTAL_PRESET
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/const/keyboard.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const DEFAULT_KEYBOARD_HORIZONTAL_PRESET: Array<IKeyboardPreset> = copyValueAsReadonly([
    {
        locale: DEFAULT_KEYBOARD_LOCALE,
        dir: 'ltr',
        charset: [
            {
                name: 'text',
                type: 'text',
                keys: [
                    [{ class: 'empty', style: 'flex: 0.5', value: null }, 'Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', { class: 'empty', style: 'flex: 0.5', value: null }],
                    [{ class: 'empty', value: null }, 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', { class: 'empty', value: null }],
                    [{ style: 'flex: 2;', class: 'secondary', value: KeyboardKeys.SHIFT, name: 'Shift' }, 'Y', 'X', 'C', 'V', 'B', 'N', 'M', { style: 'flex: 2;', class: 'secondary', value: KeyboardKeys.BACK_SPACE, name: 'Backspace', icon: KeyboardIcons.BACKSPACE }],
                    [{ class: 'secondary', value: 'charset::numeric', name: '123' }, { class: 'secondary', value: '/' }, { name: 'HE', value: KeyboardKeys.SYS_NEXT_LOCALE }, { style: 'flex: 6', value: KeyboardKeys.SPACE, name: 'Space' }, { class: 'secondary', value: '.' }, { class: 'secondary', value: KeyboardKeys.ENTER, name: 'Enter' }],
                ],
            },
            {
                name: 'symbols',
                type: 'text',
                keys: [
                    ['~', '`', '|', '•', '√', 'π', '÷', '×', '§', 'Δ'],
                    ['£', '€', '¥', 'ש', '^', '°', '=', '{', '}', '\\'],
                    [{ class: 'empty', style: 'flex: 0.5', value: null }, { class: 'secondary', value: 'charset::numeric-extend', name: '?123' }, '%', '©', '®', '™', '№', '[', ']', { class: 'secondary', value: KeyboardKeys.BACK_SPACE, name: 'Backspace', icon: KeyboardIcons.BACKSPACE }, { class: 'empty', style: 'flex: 0.5', value: null }],
                    [{ class: 'empty', style: 'flex: 0.5', value: null }, { class: 'secondary', value: 'charset::text', name: 'Abc' }, { class: 'secondary', value: '<' }, { value: 'charset::numeric', name: '123' }, { style: 'flex: 4;', value: KeyboardKeys.SPACE }, { class: 'secondary', value: '>' }, { class: 'secondary', value: KeyboardKeys.ENTER, name: 'Enter' }, { class: 'empty', style: 'flex: 0.5', value: null }],
                ],
            },
            {
                name: 'numeric',
                type: 'number',
                keys: [
                    [{ class: 'empty', style: 'flex: 1', value: null }, { class: 'secondary', value: '+' }, '1', '2', '3', { class: 'secondary', value: '%' }, { class: 'empty', style: 'flex: 1', value: null }],
                    [{ class: 'empty', style: 'flex: 1', value: null }, { class: 'secondary', value: '-' }, '4', '5', '6', { class: 'secondary', value: KeyboardKeys.SPACE }, { class: 'empty', style: 'flex: 1', value: null }],
                    [{ class: 'empty', style: 'flex: 1', value: null }, { class: 'secondary', value: '*' }, '7', '8', '9', { class: 'secondary', value: KeyboardKeys.BACK_SPACE, name: 'Backspace', icon: KeyboardIcons.BACKSPACE }, { class: 'empty', style: 'flex: 1', value: null }],
                    [{ class: 'secondary', value: 'charset::text', name: 'Abc' }, { class: 'secondary', value: ',' }, { value: 'charset::numeric-extend', name: '?123' }, '0', '=', { class: 'secondary', value: '.' }, { class: 'secondary', value: KeyboardKeys.ENTER, name: 'Enter' }],
                ],
            },
            {
                name: 'numeric-extend',
                type: 'number',
                keys: [
                    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
                    ['@', '#', '$', '_', '&', '-', '+', '(', ')', '/'],
                    [{ class: 'empty', style: 'flex: 0.5', value: null }, { class: 'secondary', value: 'charset::symbols', name: '?@' }, '*', '"', '\'', ':', ';', '!', '?', { class: 'secondary', value: KeyboardKeys.BACK_SPACE, name: 'Backspace', icon: KeyboardIcons.BACKSPACE }, { class: 'empty', style: 'flex: 0.5', value: null }],
                    [{ class: 'empty', style: 'flex: 0.5', value: null }, { class: 'secondary', value: 'charset::text', name: 'Abc' }, { class: 'secondary', value: ',' }, { class: 'secondary', value: 'charset::numeric', name: '123' }, { style: 'flex: 4;', value: KeyboardKeys.SPACE, name: 'Space' }, { class: 'secondary', value: '.' }, { class: 'secondary', value: KeyboardKeys.ENTER, name: 'Enter' }, { class: 'empty', style: 'flex: 0.5', value: null }],
                ],
            },
        ],
    },
    {
        locale: 'he-Il',
        dir: 'rtl',
        charset: [
            {
                name: 'text',
                type: 'text',
                keys: [
                    [{ class: 'empty', style: 'flex: 1', value: null }, 'פ', 'ם', 'ן', 'ו', 'ט', 'א', 'ר', 'ק', { class: 'empty', style: 'flex: 1', value: null }],
                    [{ class: 'empty', style: 'flex: 0.5', value: null }, 'ך', 'ל', 'ח', 'י', 'ע', 'כ', 'ג', 'ד', 'ש', { class: 'empty', style: 'flex: 0.5', value: null }],
                    [{ class: 'secondary', value: KeyboardKeys.SHIFT, name: 'Shift' }, 'ת', 'צ', 'מ', 'נ', 'ה', 'ב', 'ס', 'ז', { class: 'secondary', value: KeyboardKeys.BACK_SPACE, name: 'Backspace', icon: KeyboardIcons.BACKSPACE_RTL }],
                    [{ class: 'secondary', value: 'charset::numeric', name: '123' }, { class: 'secondary', value: '/' }, { name: 'EN', value: KeyboardKeys.SYS_NEXT_LOCALE }, { style: 'flex: 5', value: KeyboardKeys.SPACE, name: 'Space' }, { class: 'secondary', value: '.' }, { class: 'secondary', value: KeyboardKeys.ENTER, name: 'Enter' }],
                ],
            },
            {
                name: 'symbols',
                type: 'text',
                keys: [
                    ['~', '`', '|', '•', '√', 'π', '÷', '×', '§', 'Δ'],
                    ['£', '€', '¥', 'ש', '^', '°', '=', '{', '}', '\\'],
                    [{ class: 'empty', style: 'flex: 0.5', value: null }, { class: 'secondary', value: 'charset::numeric-extend', name: '?123' }, '%', '©', '®', '™', '№', '[', ']', { class: 'secondary', value: KeyboardKeys.BACK_SPACE, name: 'Backspace', icon: KeyboardIcons.BACKSPACE }, { class: 'empty', style: 'flex: 0.5', value: null }],
                    [{ class: 'empty', style: 'flex: 0.5', value: null }, { class: 'secondary', value: 'charset::text', name: 'אבג' }, { class: 'secondary', value: '<' }, { value: 'charset::numeric', name: '123' }, { style: 'flex: 4;', value: KeyboardKeys.SPACE }, { class: 'secondary', value: '>' }, { class: 'secondary', value: KeyboardKeys.ENTER, name: 'Enter' }, { class: 'empty', style: 'flex: 0.5', value: null }],
                ],
            },
            {
                name: 'numeric',
                type: 'number',
                keys: [
                    [{ class: 'empty', style: 'flex: 1', value: null }, { class: 'secondary', value: '+' }, '1', '2', '3', { class: 'secondary', value: '%' }, { class: 'empty', style: 'flex: 1', value: null }],
                    [{ class: 'empty', style: 'flex: 1', value: null }, { class: 'secondary', value: '-' }, '4', '5', '6', { class: 'secondary', value: KeyboardKeys.SPACE }, { class: 'empty', style: 'flex: 1', value: null }],
                    [{ class: 'empty', style: 'flex: 1', value: null }, { class: 'secondary', value: '*' }, '7', '8', '9', { class: 'secondary', value: KeyboardKeys.BACK_SPACE, name: 'Backspace', icon: KeyboardIcons.BACKSPACE }, { class: 'empty', style: 'flex: 1', value: null }],
                    [{ class: 'secondary', value: 'charset::text', name: 'אבג' }, { class: 'secondary', value: ',' }, { value: 'charset::numeric-extend', name: '?123' }, '0', '=', { class: 'secondary', value: '.' }, { class: 'secondary', value: KeyboardKeys.ENTER, name: 'Enter' }],
                ],
            },
            {
                name: 'numeric-extend',
                type: 'number',
                keys: [
                    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
                    ['@', '#', '$', '_', '&', '-', '+', '(', ')', '/'],
                    [{ class: 'empty', style: 'flex: 0.5', value: null }, { class: 'secondary', value: 'charset::symbols', name: '?@' }, '*', '"', '\'', ':', ';', '!', '?', { class: 'secondary', value: KeyboardKeys.BACK_SPACE, name: 'Backspace', icon: KeyboardIcons.BACKSPACE }, { class: 'empty', style: 'flex: 0.5', value: null }],
                    [{ class: 'empty', style: 'flex: 0.5', value: null }, { class: 'secondary', value: 'charset::text', name: 'אבג' }, { class: 'secondary', value: ',' }, { class: 'secondary', value: 'charset::numeric', name: '123' }, { style: 'flex: 4;', value: KeyboardKeys.SPACE, name: 'Space' }, { class: 'secondary', value: '.' }, { class: 'secondary', value: KeyboardKeys.ENTER, name: 'Enter' }, { class: 'empty', style: 'flex: 0.5', value: null }],
                ],
            },
        ],
    },
]);

/**
 * DEFAULT_KEYBOARD_SETTINGS
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/const/keyboard.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const DEFAULT_KEYBOARD_SETTINGS: IKeyboardSettings = {
    common: {
        focusedTargetOffset: 20,
        position: DEFAULT_KEYBOARD_POSITION,
        scrollerOffsetWhenFocused: .9,
        size: 220,
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