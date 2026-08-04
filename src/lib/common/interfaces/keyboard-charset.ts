import { KeyboardKey } from "../types";

/**
 * IKeyboardCharset
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/keyboard-charset.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IKeyboardCharset {
    name: string,
    type: string,
    keys: Array<Array<KeyboardKey>>;
}