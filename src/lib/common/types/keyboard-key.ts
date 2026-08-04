import { KeyboardKeyValue } from "./keyboard-key-value";

/**
 * KeyboardKey
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/types/keyboard-key.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type KeyboardKey = KeyboardKeyValue | { class: string; value: KeyboardKeyValue; }