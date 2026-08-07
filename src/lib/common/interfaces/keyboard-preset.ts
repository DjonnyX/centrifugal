import { KeyboardKey, TextDirection } from "../types";
import { IKeyboardCharset } from "./keyboard-charset";

/**
 * IKeyboardPreset
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/keyboard-preset.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IKeyboardPreset<K = KeyboardKey> {
        locale: string;
        dir: TextDirection;
        charset: Array<IKeyboardCharset<K>>,
}