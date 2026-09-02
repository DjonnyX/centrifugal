import { ButtonPresets } from "../../../presets";
import { IButtonTheme } from "../../components/button";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export interface IMessageCreatorControlsTheme {
    send: ButtonPresets | IButtonTheme;
    cancel: ButtonPresets | IButtonTheme;
}