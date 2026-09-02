import { ContextMenuPresets } from "../presets";
import { IContextMenuTheme } from "../interfaces/components/context-menu";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
export type PresetContextMenuTheme = { [presetName: string]: any } & {
    [ContextMenuPresets.PRIMARY]: IContextMenuTheme;
    [ContextMenuPresets.SECONDARY]: IContextMenuTheme;
};
