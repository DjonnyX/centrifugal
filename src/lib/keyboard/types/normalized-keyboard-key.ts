import { SafeHtml } from "@angular/platform-browser";
import { KeyboardKeyValue } from "../../common";

/**
 * NormalizedKeyboardKey
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/keyboard/types/normalized-keyboard-key.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export type NormalizedKeyboardKey = {
    class?: string;
    style?: string;
    name?: string | null;
    switch?: boolean;
    icon?: SafeHtml | null;
    iconPressed?: SafeHtml | null;
    value: KeyboardKeyValue;
}