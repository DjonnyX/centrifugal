import { Component, computed, input, output, Signal, TemplateRef } from "@angular/core";
import { IOverscrollEvent, ISize, OverscrollIndicatorTypes } from "../../../common";
import { INtOverscrollIndicatorContext } from "./interfaces";
import { NtOverscrollIndicatorService } from "../nt-overscroll-indicator/nt-overscroll-indicator-public-api.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, filter, tap } from "rxjs";
import { validateBoolean } from "../../../common/utils";

/**
 * NtOverscrollIndicatorComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-overscroll-indicator-container/nt-overscroll-indicator-container.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-overscroll-indicator-container',
    templateUrl: './nt-overscroll-indicator-container.component.html',
    styleUrl: './nt-overscroll-indicator-container.component.scss',
    host: {
        'style': `
            position: relative;
            width: 100%;
            height: 100%;
            display: block;
            pointer-events: none;
        `
    },
    standalone: false,
})
export class NtOverscrollIndicatorContainerComponent {
    readonly onLeftIndiatorTrigger = output<boolean>();

    readonly onTopIndiatorTrigger = output<boolean>();

    readonly onRightIndiatorTrigger = output<boolean>();

    readonly onBottomIndiatorTrigger = output<boolean>();

    readonly bounds = input<ISize>({ width: 0, height: 0 });

    readonly overscrollEvent = input<IOverscrollEvent | null>(null);

    readonly leftOffset = input<number>(0);

    readonly topOffset = input<number>(0);

    readonly rightOffset = input<number>(0);

    readonly bottomOffset = input<number>(0);

    readonly leftIndicatorEnabled = input<boolean>(false);

    readonly topIndicatorEnabled = input<boolean>(false);

    readonly rightIndicatorEnabled = input<boolean>(false);

    readonly bottomIndicatorEnabled = input<boolean>(false);

    readonly leftIndicatorRenderer = input<TemplateRef<any> | null>(null);

    readonly topIndicatorRenderer = input<TemplateRef<any> | null>(null);

    readonly rightIndicatorRenderer = input<TemplateRef<any> | null>(null);

    readonly bottomIndicatorRenderer = input<TemplateRef<any> | null>(null);

    protected _leftService = new NtOverscrollIndicatorService();

    protected _topService = new NtOverscrollIndicatorService();

    protected _rightService = new NtOverscrollIndicatorService();

    protected _bottomService = new NtOverscrollIndicatorService();

    protected _leftContext: Signal<{ context: INtOverscrollIndicatorContext }>;

    protected _topContext: Signal<{ context: INtOverscrollIndicatorContext }>;

    protected _rightContext: Signal<{ context: INtOverscrollIndicatorContext }>;

    protected _bottomContext: Signal<{ context: INtOverscrollIndicatorContext }>;

    constructor() {
        this._leftContext = computed(() => {
            return {
                context: {
                    api: this._leftService,
                    bounds: this.bounds(),
                    overscrollEvent: this.overscrollEvent(),
                    leftOffset: this.leftOffset(),
                    topOffset: this.topOffset(),
                    rightOffset: this.rightOffset(),
                    bottomOffset: this.bottomOffset(),
                    enabled: this.leftIndicatorEnabled(),
                    type: OverscrollIndicatorTypes.LEFT,
                },
            };
        });

        this._rightContext = computed(() => {
            return {
                context: {
                    api: this._rightService,
                    bounds: this.bounds(),
                    overscrollEvent: this.overscrollEvent(),
                    leftOffset: this.leftOffset(),
                    topOffset: this.topOffset(),
                    rightOffset: this.rightOffset(),
                    bottomOffset: this.bottomOffset(),
                    enabled: this.rightIndicatorEnabled(),
                    type: OverscrollIndicatorTypes.RIGHT,
                },
            };
        });

        this._topContext = computed(() => {
            return {
                context: {
                    api: this._topService,
                    bounds: this.bounds(),
                    overscrollEvent: this.overscrollEvent(),
                    leftOffset: this.leftOffset(),
                    topOffset: this.topOffset(),
                    rightOffset: this.rightOffset(),
                    bottomOffset: this.bottomOffset(),
                    enabled: this.topIndicatorEnabled(),
                    type: OverscrollIndicatorTypes.TOP,
                },
            };
        });

        this._bottomContext = computed(() => {
            return {
                context: {
                    api: this._bottomService,
                    bounds: this.bounds(),
                    overscrollEvent: this.overscrollEvent(),
                    leftOffset: this.leftOffset(),
                    topOffset: this.topOffset(),
                    rightOffset: this.rightOffset(),
                    bottomOffset: this.bottomOffset(),
                    enabled: this.bottomIndicatorEnabled(),
                    type: OverscrollIndicatorTypes.BOTTOM,
                }
            };
        });

        this._leftService.$pinned.pipe(
            takeUntilDestroyed(),
            debounceTime(0),
            filter(v => validateBoolean(v)),
            tap(v => {
                this.onLeftIndiatorTrigger.emit(v);
            }),
        ).subscribe();

        this._topService.$pinned.pipe(
            takeUntilDestroyed(),
            debounceTime(0),
            filter(v => validateBoolean(v)),
            tap(v => {
                this.onTopIndiatorTrigger.emit(v);
            }),
        ).subscribe();

        this._rightService.$pinned.pipe(
            takeUntilDestroyed(),
            debounceTime(0),
            filter(v => validateBoolean(v)),
            tap(v => {
                this.onRightIndiatorTrigger.emit(v);
            }),
        ).subscribe();

        this._bottomService.$pinned.pipe(
            takeUntilDestroyed(),
            debounceTime(0),
            filter(v => validateBoolean(v)),
            tap(v => {
                this.onBottomIndiatorTrigger.emit(v);
            }),
        ).subscribe();
    }
}