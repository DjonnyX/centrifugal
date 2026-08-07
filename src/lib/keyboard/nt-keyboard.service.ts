import { DestroyRef, inject, Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, filter, of, Subject, switchMap, tap } from "rxjs";
import { DEFAULT_KEYBOARD_LOCALE, DEFAULT_KEYBOARD_POSITION, KEY_CHARSET, KEY_SYS } from "../common/const/keyboard";
import { IKeyboardSettings, KeyboardKey, KeyboardKeys, KeyboardKeyStates, KeyboardPosition } from "../common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { KEYBOARD_VERTICAL_POSITIONS, SERVICE_KEYS } from "./const";
import { IKeyboardCharset } from "../common/interfaces/keyboard-charset";
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

    private _$presetIndex = new BehaviorSubject<number>(-1);
    readonly $presetIndex = this._$presetIndex.asObservable();
    get presetIndex() { return this._$presetIndex.getValue(); }

    private _$charsetIndex = new BehaviorSubject<number>(-1);
    readonly $charsetIndex = this._$charsetIndex.asObservable();
    get charsetIndex() { return this._$charsetIndex.getValue(); }

    private _$charset = new BehaviorSubject<IKeyboardCharset<NormalizedKeyboardKey> | null>(null);
    readonly $charset = this._$charset.asObservable();
    get charset() { return this._$charset.getValue(); }

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
        const $settings = this.$settings
        $settings.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            tap(settings => {
                this._$position.next(settings.common.position);
                this._$isVertical.next(KEYBOARD_VERTICAL_POSITIONS.indexOf(settings.common.position) > -1);
                this._$presetIndex.next(settings.preset.length > 0 ? 0 : -1);
            }),
        ).subscribe();

        const $presetIndex = this.$presetIndex;
        $presetIndex.pipe(
            takeUntilDestroyed(),
            tap(v => {
                const settings = this.settings, preset = !!settings && v > -1 ? settings.preset[v] : null;
                this._$preset.next(preset);
                this._$charsetIndex.next(v > -1 && preset?.charset && preset?.charset?.length > 0 ? 0 : -1);
                this._$locale.next(preset?.locale ?? DEFAULT_KEYBOARD_LOCALE);
            }),
        ).subscribe();

        const $charsetIndex = this.$charsetIndex;
        combineLatest([$presetIndex, $charsetIndex]).pipe(
            takeUntilDestroyed(),
            tap(([p, c]) => {
                const settings = this.settings, preset = !!settings && p > -1 ? settings.preset[p] : null,
                    charset = preset !== null && c > -1 ? preset.charset[c] : null;
                this._$charset.next(charset);
            }),
        ).subscribe();

        const $caps = this.$caps;
        $caps.pipe(
            takeUntilDestroyed(),
            switchMap(v => {
                if (v) {
                    return combineLatest([this.$keyClick.pipe(
                        takeUntilDestroyed(this._destroyRef),
                        filter(v => v !== KeyboardKeys.SHIFT),
                    ), this.$keyRelease.pipe(
                        takeUntilDestroyed(this._destroyRef),
                        filter(v => v !== KeyboardKeys.SHIFT),
                    )]).pipe(
                        takeUntilDestroyed(this._destroyRef),
                        tap(() => {
                            this._$caps.next(false);
                        }),
                    );
                }
                return of(null);
            }),
        ).subscribe()
    }

    nextCharset() {
        const preset = this.preset;
        if (!!preset) {
            const index = this.charsetIndex, length = this.preset?.charset.length ?? 0,
                nextIndex = length == 0 || index === length - 1 ? 0 : index + 1;
                console.log('next', nextIndex)
            this._$charset.next(this.preset.charset[nextIndex]);
            this._$charsetIndex.next(nextIndex);
        }
    }

    setCaps(v: boolean) {
        if (this.caps !== v) {
            this._$capsOnce.next(true);
            this._$caps.next(v);
        }
    }

    fireKeyEvent(key: NormalizedKeyboardKey, state: KeyboardKeyState) {
        if (key.value?.indexOf(KEY_SYS) === -1 && key.value?.indexOf(KEY_CHARSET) === -1) {
            switch (key.value) {
                case KeyboardKeys.SHIFT: {
                    if (state === KeyboardKeyStates.CLICK) {
                        this._$capsOnce.next(true);
                        this._$caps.next(!this.caps);
                    } else if (state === KeyboardKeyStates.LONG_CLICK) {
                        const caps = this.caps;
                        this._$capsOnce.next(!caps);
                        this._$caps.next(!caps);
                    }
                    break;
                }
            }
        }

        const value = this.caps && !!key?.value && key.value?.indexOf(KEY_SYS) === -1 && key.value?.indexOf(KEY_CHARSET) === -1 && SERVICE_KEYS.indexOf(key.value as any) === -1 ?
            key.value?.toLocaleUpperCase() ?? null : key.value ?? null;
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
            case KeyboardKeyStates.LONG_CANCEL: {
                this._$keyRelease.next(value);
                break;
            }
        }
    }
}