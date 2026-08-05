import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, Signal, TemplateRef, ViewEncapsulation } from "@angular/core";
import { NtKeyboardService } from "./nt-keyboard.service";
import { IKeyboardSettings, KeyboardKey, KeyboardKeyValue, TextDirection, TextDirections } from "../common";
import { DEFAULT_KEYBOARD_SETTINGS } from "../common/const/keyboard";
import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { fromEvent, switchMap, tap } from "rxjs";
import { KEY_DOWN, KEY_UP } from "../common/const/event-names";

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

    protected _containerClass: Signal<{ [className: string]: boolean }>;

    protected _destroyRef = inject(DestroyRef);

    constructor() {
        const $settings = toObservable(this.settings);
        $settings.pipe(
            takeUntilDestroyed(),
            tap(v => {
                this._service.settings = v;
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

    normalizeKey(key: KeyboardKey) {
        let classes: string | null | undefined, style: string | null | undefined, value: KeyboardKeyValue = null;
        if (typeof key === 'object') {
            classes = key?.class ?? '';
            style = key?.style ?? '';
            value = key?.value ?? null;
        } else {
            value = key ?? '';
            classes = '';
            style = '';
        }
        return {
            class: classes,
            style,
            value,
        };
    }
}