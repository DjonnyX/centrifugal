import { ButtonPresets } from "../presets";
import { IButtonTheme } from "../interfaces/components/button";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export type PresetCheckboxesTheme = { [presetName: string]: any } & {
    [ButtonPresets.PRIMARY]: IButtonTheme;
    [ButtonPresets.SECONDARY]: IButtonTheme;
    [ButtonPresets.THRID]: IButtonTheme;
    [ButtonPresets.SUCCESS]: IButtonTheme;
    [ButtonPresets.WARN]: IButtonTheme;
};
