import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, Signal, TemplateRef, ViewEncapsulation } from "@angular/core";
import { NtKeyboardService } from "./nt-keyboard.service";
import { IKeyboardSettings, TextDirection, TextDirections } from "../common";
import { DEFAULT_KEYBOARD_SETTINGS } from "../common/const/keyboard";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { fromEvent, switchMap, tap } from "rxjs";
import { KEY_DOWN, KEY_UP } from "../common/const/event-names";
import { normalizeSettings } from "./utils";
import { DomSanitizer } from "@angular/platform-browser";

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
    providers: [
        NtKeyboardService,
    ],
})
export class NtKeyboardComponent {
    private _service = inject(NtKeyboardService);

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
        $settings.pipe(
            takeUntilDestroyed(),
            tap(v => {
                const normalizedSettings = normalizeSettings(v, this._sanitizer);
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

        const $keyDown = fromEvent(window, KEY_DOWN),
            $keyUp = fromEvent(window, KEY_UP);

        $keyDown.pipe(
            takeUntilDestroyed(),
            switchMap(e => {
                return $keyUp.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    tap(e => {

                    }),
                );
            }),
        ).subscribe();
    }
}