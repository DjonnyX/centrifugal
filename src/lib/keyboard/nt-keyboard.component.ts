import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, Signal, TemplateRef, ViewEncapsulation } from "@angular/core";
import { NtKeyboardService } from "./nt-keyboard.service";
import { IKeyboardSettings, KeyboardKeys, KeyboardKeyStates, TextDirection, TextDirections } from "../common";
import { DEFAULT_KEYBOARD_SETTINGS } from "../common/const/keyboard";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { combineLatest, fromEvent, switchMap, tap } from "rxjs";
import { KEY_DOWN, KEY_UP } from "../common/const/event-names";
import { normalizeSettings } from "./utils";
import { DomSanitizer } from "@angular/platform-browser";
import { NormalizedKeyboardKey } from "./types";

/**
 * NtKeyboardComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/keyboard/nt-keyboard.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-keyboard',
    templateUrl: './nt-keyboard.component.html',
    styleUrl: './nt-keyboard.component.scss',
    host: {
        'style': 'position: relative; display: block; width: 100%; height: 100%;'
    },
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class NtKeyboardComponent {
    private _service = inject(NtKeyboardService);

    get $caps() { return this._service.$caps; }

    settings = input<IKeyboardSettings>(DEFAULT_KEYBOARD_SETTINGS);

    keyRenderer = input<TemplateRef<any> | null>(null);

    langTextDir = input<TextDirection>(TextDirections.LTR);

    get $charset() { return this._service.$charset };

    get $isVertical() { return this._service.$isVertical; }

    get normalizedSettings() { return this._service.$settings; }

    protected _containerClass: Signal<{ [className: string]: boolean }>;

    protected _sanitizer = inject(DomSanitizer);

    protected _destroyRef = inject(DestroyRef);

    constructor() {
        const $settings = toObservable(this.settings);
        combineLatest([$settings, this._service.$caps]).pipe(
            takeUntilDestroyed(),
            tap(([settings, caps]) => {
                const normalizedSettings = normalizeSettings(settings, caps, this._sanitizer);
                this._service.settings = normalizedSettings;
            }),
        ).subscribe();

        const charset = toSignal(this.$charset);
        this._containerClass = computed(() => {
            const c = charset();
            if (!c) {
                return {};
            }
            return { [c.name]: true, [c.type]: true };
        });

        const $keyDown = fromEvent<KeyboardEvent>(window, KEY_DOWN),
            $keyUp = fromEvent<KeyboardEvent>(window, KEY_UP);

        $keyDown.pipe(
            takeUntilDestroyed(),
            switchMap(e => {
                const isCaps = e.getModifierState(KeyboardKeys.CAPS_LOCK);
                this._service.setCaps(e.shiftKey || isCaps);
                this._service.fireKeyEvent({ value: e.key, name: e.key }, KeyboardKeyStates.PRESS);
                return $keyUp.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    tap(e => {
                        const isCaps = e.getModifierState(KeyboardKeys.CAPS_LOCK);
                        this._service.setCaps(e.shiftKey || isCaps);
                        this._service.fireKeyEvent({ value: e.key, name: e.key }, KeyboardKeyStates.CLICK);
                    }),
                );
            }),
        ).subscribe();
    }

    onPressHandler(e: Event, key: NormalizedKeyboardKey) {
        this._service.fireKeyEvent(key, KeyboardKeyStates.PRESS);
    }

    onClickCancelHandler(key: NormalizedKeyboardKey) {
        this._service.fireKeyEvent(key, KeyboardKeyStates.CLICK_CANCEL);
    }

    onClickHandler(e: Event, key: NormalizedKeyboardKey) {
        this._service.fireKeyEvent(key, KeyboardKeyStates.CLICK);
    }

    onLongPressActivateHandler(value: boolean, key: NormalizedKeyboardKey) {
        this._service.fireKeyEvent(key, KeyboardKeyStates.LONG_PRESS);
    }

    onLongClickCancelHandler(key: NormalizedKeyboardKey) {
        this._service.fireKeyEvent(key, KeyboardKeyStates.LONG_CANCEL);
    }

    onLongPressHandler(key: NormalizedKeyboardKey) {
        this._service.fireKeyEvent(key, KeyboardKeyStates.LONG_PRESS);
    }
}