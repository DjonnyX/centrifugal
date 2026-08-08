import { KeyboardKey, TextDirection } from "../types";
import { IKeyboardLayout } from "./keyboard-layout";

/**
 * IKeyboardPreset
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/keyboard-preset.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IKeyboardPreset<K = KeyboardKey> {
        locale: string;
        dir: TextDirection;
        layout: Array<IKeyboardLayout<K>>,
}