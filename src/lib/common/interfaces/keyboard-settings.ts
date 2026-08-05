import { KeyboardPosition } from "../types/keyboard-position";
import { IKeyboardPreset } from "./keyboard-preset";

/**
 * IKeyboardSettings
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/interfaces/keyboard-settings.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IKeyboardSettings {
    common: {
        focusedTargetOffset: number;
        position: KeyboardPosition;
        scrollerOffsetWhenFocused: number;
        size: number;
    };
    animation: {
        transition: {
            in: number;
            out: number;
            focusedScroller: number;
        };
    };
    preset: Array<IKeyboardPreset>;
}
