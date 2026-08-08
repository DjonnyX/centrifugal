import { DestroyRef, inject, Injectable } from "@angular/core";
import { BehaviorSubject, debounceTime, delay, distinctUntilChanged, filter, Subject, tap } from "rxjs";
import { DEFAULT_KEYBOARD_LANG_DIR, DEFAULT_KEYBOARD_LOCALE, DEFAULT_KEYBOARD_POSITION, KEY_LAYOUT, KEY_SYS } from "../common/const/keyboard";
import { IKeyboardSettings, KeyboardKey, KeyboardKeys, KeyboardKeyStates, KeyboardPosition, TextDirection, TextDirections } from "../common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { KEYBOARD_VERTICAL_POSITIONS, SERVICE_KEYS } from "./const";
import { IKeyboardLayout } from "../common/interfaces/keyboard-layout";
import { NormalizedKeyboardKey } from "./types";
import { KeyboardKeyState } from "../common/types/keyboard-key-state";
import { IKeyboardPreset } from "../common/interfaces/keyboard-preset";

/**
 * NtKeyboardService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/keyboard/keyboard.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
    providedIn: 'root'
})
export class NtKeyboardService {
    private _$locale = new BehaviorSubject<string>(DEFAULT_KEYBOARD_LOCALE);
    readonly $locale = this._$locale.asObservable();
    get locale() { return this._$locale.getValue(); }

    private _$dir = new BehaviorSubject<string>(DEFAULT_KEYBOARD_LANG_DIR);
    readonly $dir = this._$dir.asObservable();
    get dir() { return this._$dir.getValue(); }

    private _$presetIndex = new BehaviorSubject<number>(-1);
    readonly $presetIndex = this._$presetIndex.asObservable();
    get presetIndex() { return this._$presetIndex.getValue(); }

    private _$layoutIndex = new BehaviorSubject<number>(-1);
    readonly $layoutIndex = this._$layoutIndex.asObservable();
    get layoutIndex() { return this._$layoutIndex.getValue(); }

    private _$layout = new BehaviorSubject<IKeyboardLayout<NormalizedKeyboardKey> | null>(null);
    readonly $layout = this._$layout.asObservable();
    get layout() { return this._$layout.getValue(); }

    private _$preset = new BehaviorSubject<IKeyboardPreset<NormalizedKeyboardKey> | null>(null);
    readonly $preset = this._$preset.asObservable();
    get preset() { return this._$preset.getValue(); }

    private _$position = new BehaviorSubject<KeyboardPosition>(DEFAULT_KEYBOARD_POSITION);
    readonly $position = this._$position.asObservable();
    get position() { return this._$position.getValue(); }

    private _$isVertical = new BehaviorSubject<boolean>(KEYBOARD_VERTICAL_POSITIONS.indexOf(this.position) > -1);
    readonly $isVertical = this._$isVertical.asObservable();
    get isVertical() { return this._$isVertical.getValue(); }

    private _$settings = new BehaviorSubject<IKeyboardSettings<NormalizedKeyboardKey> | null>(null);
    readonly $settings = this._$settings.asObservable();
    get settings() { return this._$settings.getValue(); }
    set settings(v: IKeyboardSettings<NormalizedKeyboardKey> | null) {
        if (this.settings !== v) {
            this._$settings.next(v);
        }
    }

    private _$latgTextDir = new BehaviorSubject<TextDirection>(TextDirections.LTR);
    readonly $latgTextDir = this._$latgTextDir.asObservable();
    get latgTextDir() { return this._$latgTextDir.getValue(); }

    private _$caps = new BehaviorSubject<boolean>(false);
    readonly $caps = this._$caps.asObservable();
    get caps() { return this._$caps.getValue(); }

    private _$capsOnce = new BehaviorSubject<boolean>(true);
    readonly $capsOnce = this._$capsOnce.asObservable();
    get capsOnce() { return this._$capsOnce.getValue(); }

    private _$keyClick = new Subject<KeyboardKey>();
    readonly $keyClick = this._$keyClick.asObservable();

    private _$keyPress = new Subject<KeyboardKey>();
    readonly $keyPress = this._$keyPress.asObservable();

    private _$keyRelease = new Subject<KeyboardKey>();
    readonly $keyRelease = this._$keyRelease.asObservable();

    private _destroyRef = inject(DestroyRef);

    constructor() {
        let prevCaps = this.caps;
        const $settings = this.$settings
        $settings.pipe(
            takeUntilDestroyed(),
            distinctUntilChanged(),
            filter(v => !!v),
            tap(settings => {
                this._$position.next(settings.common.position);
                this._$isVertical.next(KEYBOARD_VERTICAL_POSITIONS.indexOf(settings.common.position) > -1);
                if (prevCaps !== this.caps) {
                    const currentPresetIndex = this.presetIndex, presetLength = settings?.preset?.length ?? 0,
                        actualPresetIndex = currentPresetIndex > -1 && presetLength > 0 && presetLength - 1 >= currentPresetIndex ? currentPresetIndex : presetLength > 0 ? 0 : -1;
                    if (currentPresetIndex !== actualPresetIndex) {
                        this._$presetIndex.next(actualPresetIndex);
                    }
                } else {
                    this._$presetIndex.next(0);
                }
                prevCaps = this.caps;
            }),
        ).subscribe();

        const $presetIndex = this.$presetIndex;
        $presetIndex.pipe(
            takeUntilDestroyed(),
            tap(v => {
                const settings = this.settings;
                if (!!settings) {
                    const preset = !!settings && v > -1 ? settings.preset[v] : null;
                    this._$preset.next(preset);
                }
            }),
        ).subscribe();

        const $preset = this.$preset;
        $preset.pipe(
            takeUntilDestroyed(),
            tap(v => {
                this._$layoutIndex.next(0);
                this._$latgTextDir.next(v?.dir ?? TextDirections.LTR);
            }),
        ).subscribe();

        const $layoutIndex = this.$layoutIndex;
        $layoutIndex.pipe(
            takeUntilDestroyed(),
            debounceTime(0),
            tap(l => {
                const preset = this.preset;
                if (!!preset) {
                    const layout = preset !== null && l > -1 ? preset.layout[l] : null;
                    this._$layout.next(layout);
                }
            }),
        ).subscribe();

        this.$keyClick.pipe(
            takeUntilDestroyed(this._destroyRef),
            filter(v => v !== KeyboardKeys.SHIFT),
            delay(1),
            tap(() => {
                if (this.capsOnce) {
                    this._$caps.next(false);
                }
            }),
        ).subscribe();
    }

    nextPreset() {
        const settings = this.settings;
        if (!!settings) {
            const index = this.presetIndex, length = settings.preset?.length ?? 0,
                nextIndex = length == 0 || index === length - 1 ? 0 : index + 1;
            this._$presetIndex.next(nextIndex);
        }
    }

    nextLayout(options?: { name?: string; index?: number; type?: string; }) {
        const index = options?.index ?? -1, name = options?.name ?? null, type = options?.type ?? null;
        if (index > -1) {
            const preset = this.preset;
            if (!!preset) {
                this._$layoutIndex.next(index);
            }
        } else if (!!name) {
            const preset = this.preset;
            if (!!preset) {
                const index = (preset?.layout?.findIndex(v => `${KEY_LAYOUT}${(v?.name ?? '')}` === name) ?? 0);
                if (index > -1) {
                    this._$layoutIndex.next(index);
                }
            }
        } else if (!!type) {
            const preset = this.preset;
            if (!!preset && !!preset.layout) {
                for (let i = 0, l = preset.layout.length; i < l; i++) {
                    const l = preset.layout[i];
                    if (!!l.type && l.type.indexOf(type) > -1) {
                        this._$layoutIndex.next(i);
                        return;
                    }
                }
                if (preset.layout.length > 0) {
                    this._$layoutIndex.next(0);
                }
            }
        } else {
            const preset = this.preset;
            if (!!preset) {
                const index = this.layoutIndex, length = this.preset?.layout.length ?? 0,
                    nextIndex = length == 0 || index === length - 1 ? 0 : index + 1;
                this._$layoutIndex.next(nextIndex);
            }
        }
    }

    setCaps(v: boolean) {
        if (this.caps !== v) {
            this._$capsOnce.next(true);
            this._$caps.next(v);
        }
    }

    fireKeyEvent(key: NormalizedKeyboardKey, state: KeyboardKeyState) {
        if (key.value?.indexOf(KEY_SYS) === -1 && key.value?.indexOf(KEY_LAYOUT) === -1) {
            switch (key.value) {
                case KeyboardKeys.SHIFT: {
                    if (state === KeyboardKeyStates.CLICK) {
                        this._$capsOnce.next(true);
                        this._$caps.next(!this.caps);
                    } else if (state === KeyboardKeyStates.LONG_CLICK) {
                        this._$capsOnce.next(false);
                        this._$caps.next(true);
                    }
                    break;
                }
            }
        }

        const value = this.caps && !!key?.value && key.value?.indexOf(KEY_SYS) === -1 && key.value?.indexOf(KEY_LAYOUT) === -1 && SERVICE_KEYS.indexOf(key.value as any) === -1 ?
            key.value?.toUpperCase() ?? null : key.value ?? null;
        switch (state) {
            case KeyboardKeyStates.PRESS: {
                this._$keyPress.next(value);
                break;
            }
            case KeyboardKeyStates.CLICK: {
                this._$keyClick.next(value);
                break;
            }
            case KeyboardKeyStates.CLICK_CANCEL: {
                this._$keyRelease.next(value);
                break;
            }
        }
    }
}