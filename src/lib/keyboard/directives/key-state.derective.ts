import { Directive, ElementRef, inject, input } from "@angular/core";
import { NtKeyboardService } from "../nt-keyboard.service";
import { KeyboardKeys, KeyboardKeyValue } from "../../common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter, tap } from "rxjs";
import { toggleClassName } from "../../common/utils";
import { NOT_PRESSED, PRESSED } from "../../common/directives/nt-control/const/classes";

/**
 * NtKeyStateDirective
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/keyboard/directives/key-state.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Directive({
    selector: '[keyState]',
    standalone: false,
})
export class NtKeyStateDirective {
    private _service = inject(NtKeyboardService);

    key = input<KeyboardKeyValue | null | undefined>(null);

    private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    constructor() {
        const $keyPress = this._service.$keyPress,
            $keyRelease = this._service.$keyRelease,
            $keyClick = this._service.$keyClick,
            $caps = this._service.$caps,
            element = this._elementRef.nativeElement;

        $caps.pipe(
            takeUntilDestroyed(),
            filter(() => this.key() === KeyboardKeys.SHIFT),
            tap(v => {
                toggleClassName(element, v ? PRESSED : NOT_PRESSED, [v ? NOT_PRESSED : PRESSED]);
            }),
        ).subscribe();

        $keyPress.pipe(
            takeUntilDestroyed(),
            filter((v => v === this.key())),
            tap(() => {
                toggleClassName(element, PRESSED, [NOT_PRESSED]);
            }),
        ).subscribe();

        $keyRelease.pipe(
            takeUntilDestroyed(),
            filter(v => {
                const key = this.key();
                return v === key || key === KeyboardKeys.SHIFT;
            }),
            tap(v => {
                if (this.key() === KeyboardKeys.SHIFT) {
                    toggleClassName(element, this._service.caps ? PRESSED : NOT_PRESSED, [this._service.caps ? NOT_PRESSED : PRESSED]);
                    return;
                }
                toggleClassName(element, NOT_PRESSED, [PRESSED]);
            }),
        ).subscribe();

        $keyClick.pipe(
            takeUntilDestroyed(),
            filter(v => {
                const key = this.key();
                return v === key || key === KeyboardKeys.SHIFT;
            }),
            tap(v => {
                if (this.key() === KeyboardKeys.SHIFT) {
                    toggleClassName(element, this._service.caps ? PRESSED : NOT_PRESSED, [this._service.caps ? NOT_PRESSED : PRESSED]);
                    return;
                }
                toggleClassName(element, NOT_PRESSED, [PRESSED]);
            }),
        ).subscribe();
    }
}