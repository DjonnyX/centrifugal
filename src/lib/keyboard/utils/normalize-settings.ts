import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { IKeyboardSettings, KeyboardKey, KeyboardKeyValue } from "../../common";
import { NormalizedKeyboardKey } from '../types/normalized-keyboard-key';
import { copyValueAsReadonly } from "../../common/utils";
import { SERVICE_KEYS } from "../const";

/**
 * normalizeSettings
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/keyboard/utils/normalize-settings.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const normalizeSettings = (settings: IKeyboardSettings, caps: boolean, sanitizer?: DomSanitizer): IKeyboardSettings<NormalizedKeyboardKey> => {
    const result: IKeyboardSettings<NormalizedKeyboardKey> = JSON.parse(JSON.stringify(settings));
    for (let i = 0, l = result.preset.length; i < l; i++) {
        const preset = result.preset[i];
        for (let j = 0, l1 = preset.layout.length; j < l1; j++) {
            const layout = preset.layout[j];
            for (let k = 0, l2 = layout.keys.length; k < l2; k++) {
                const keyRow = layout.keys[k];
                for (let m = 0, l3 = keyRow.length; m < l3; m++) {
                    const key = keyRow[m];
                    keyRow[m] = normalizeKey(key as KeyboardKey, caps, sanitizer);
                }
            }
        }
    }
    return copyValueAsReadonly(result);
}

/**
 * normalizeKey
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/keyboard/utils/normalize-settings.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
const normalizeKey = (key: KeyboardKey, caps: boolean, sanitizer?: DomSanitizer): NormalizedKeyboardKey => {
    let classes: string | null | undefined, style: string | null | undefined, name: string | null, icon: SafeHtml | null, iconPressed: SafeHtml | null,
        value: KeyboardKeyValue = null;
    if (typeof key === 'object') {
        classes = key?.class ?? '';
        style = key?.style ?? '';
        value = transform(key?.value ?? null, caps);
        name = key?.name ?? value ?? null;
        icon = !!key?.icon && !!sanitizer ? sanitizer.bypassSecurityTrustHtml(key.icon) : null;
        iconPressed = !!key?.iconPressed && !!sanitizer ? sanitizer.bypassSecurityTrustHtml(key.iconPressed) : null;
    } else {
        value = transform(key ?? '', caps);
        classes = '';
        style = '';
        name = value;
        icon = null;
        iconPressed = null;
    }
    return {
        class: classes,
        style,
        value,
        name,
        icon,
        iconPressed,
    };
}

const transform = (value: KeyboardKeyValue, caps: boolean): KeyboardKeyValue => {
    if (!!value && SERVICE_KEYS.indexOf(value as any) > -1) {
        return value;
    }
    return caps ? (value?.toUpperCase() ?? null) : (value?.toLowerCase() ?? null);
}