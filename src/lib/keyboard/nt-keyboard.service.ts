import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, tap } from "rxjs";
import { DEFAULT_KEYBOARD_LOCALE, DEFAULT_KEYBOARD_POSITION, DEFAULT_KEYBOARD_SETTINGS } from "../common/const/keyboard";
import { IKeyboardSettings, KeyboardPosition } from "../common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { KEYBOARD_VERTICAL_POSITIONS } from "./const";
import { IKeyboardCharset } from "../common/interfaces/keyboard-charset";

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

    private _$charset = new BehaviorSubject<IKeyboardCharset | null>(null);
    readonly $charset = this._$charset.asObservable();
    get charset() { return this._$charset.getValue(); }

    private _$position = new BehaviorSubject<KeyboardPosition>(DEFAULT_KEYBOARD_POSITION);
    readonly $position = this._$position.asObservable();
    get position() { return this._$position.getValue(); }

    private _$isVertical = new BehaviorSubject<boolean>(KEYBOARD_VERTICAL_POSITIONS.indexOf(this.position) > -1);
    readonly $isVertical = this._$isVertical.asObservable();
    get isVertical() { return this._$isVertical.getValue(); }

    private _$settings = new BehaviorSubject<IKeyboardSettings>(DEFAULT_KEYBOARD_SETTINGS);
    readonly $settings = this._$settings.asObservable();
    get settings() { return this._$settings.getValue(); }
    set settings(v: IKeyboardSettings) {
        if (this.settings !== v) {
            this._$settings.next(v);
        }
    }

    constructor() {
        const $settings = this.$settings
        $settings.pipe(
            takeUntilDestroyed(),
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
                const settings = this.settings, preset = v > -1 ? settings.preset[v] : null;
                this._$charsetIndex.next(v > -1 && preset?.charset && preset?.charset?.length > 0 ? 0 : -1);
                this._$locale.next(preset?.locale ?? DEFAULT_KEYBOARD_LOCALE);
            }),
        ).subscribe();

        const $charsetIndex = this.$charsetIndex;
        combineLatest([$presetIndex, $charsetIndex]).pipe(
            takeUntilDestroyed(),
            tap(([p, c]) => {
                const settings = this.settings, preset = p > -1 ? settings.preset[p] : null,
                    charset = preset !== null && c > -1 ? preset.charset[c] : null;
                this._$charset.next(charset);
            }),
        ).subscribe();
    }

    fireKeyEvent(key: string) {

    }
}