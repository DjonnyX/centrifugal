import {
    DestroyRef,
    Directive, ElementRef, inject, OnInit, output, signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, switchMap, tap } from 'rxjs';
import { ClickOutsideService } from './click-outside.service';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Directive({
    selector: '[clickOutside]',
})
export class ClickOutsideDirective implements OnInit {
    onClickOutside = output<Event>();

    onClick = output<Event>();

    onOutsideClose = output<{ target: EventTarget; }>();

    private initialized = signal(false);

    private _service = inject(ClickOutsideService);

    private _elementRef = inject(ElementRef<HTMLElement>);

    private _destroyRef = inject(DestroyRef);

    constructor() {
        const element: HTMLElement = this._elementRef.nativeElement, $initialized = toObservable(this.initialized);

        $initialized.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            switchMap(() => {
                this._service.activeTarget = element;
                return this._service.$onClick.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    tap(e => {
                        const element: HTMLElement = this._elementRef.nativeElement;
                        if (e.target === element) {
                            this.onClick.emit(e);
                        } else {
                            this.onClickOutside.emit(e);
                        }
                    }),
                );
            }),
        ).subscribe();
    }

    ngOnInit(): void {
        this.initialized.set(true);
    }
}
