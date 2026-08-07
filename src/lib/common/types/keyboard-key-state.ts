import { KeyboardKeyStates } from "../enums";

/**
 * KeyboardKeyState
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/keyboard-key-state.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type KeyboardKeyState = KeyboardKeyStates | 'press' | 'clickcancel' | 'click' | 'longpress' | 'longclickcancel' | 'longclick';