import { KeyboardKey } from "../types";

/**
 * IKeyboardLayout
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/keyboard-layout.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IKeyboardLayout<K = KeyboardKey> {
    name: string,
    type: Array<string>,
    keys: Array<Array<K>>;
}