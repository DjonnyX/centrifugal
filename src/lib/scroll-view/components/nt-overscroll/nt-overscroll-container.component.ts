import { Component, computed, input, output, Signal, TemplateRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, filter, tap } from "rxjs";
import { IOverscrollEvent, ISize, OverscrollAreaTypes } from "../../../common";
import { INtOverscrollAreaContext } from "./interfaces";
import { NtOverscrollAreaService } from "../nt-overscroll-area/nt-overscroll-area-public-api.service";
import { validateBoolean } from "../../../common/utils";

/**
 * NtOverscrollContainerComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-overscroll-container/nt-overscroll-container.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-overscroll-container',
    templateUrl: './nt-overscroll-container.component.html',
    styleUrl: './nt-overscroll-container.component.scss',
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
export class NtOverscrollContainerComponent {
    readonly onLeftAreaTrigger = output<boolean>();

    readonly onTopAreaTrigger = output<boolean>();

    readonly onRightAreaTrigger = output<boolean>();

    readonly onBottomAreaTrigger = output<boolean>();

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

    protected _leftService = new NtOverscrollAreaService();

    protected _topService = new NtOverscrollAreaService();

    protected _rightService = new NtOverscrollAreaService();

    protected _bottomService = new NtOverscrollAreaService();

    protected _leftContext: Signal<{ context: INtOverscrollAreaContext }>;

    protected _topContext: Signal<{ context: INtOverscrollAreaContext }>;

    protected _rightContext: Signal<{ context: INtOverscrollAreaContext }>;

    protected _bottomContext: Signal<{ context: INtOverscrollAreaContext }>;

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
                    type: OverscrollAreaTypes.LEFT,
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
                    type: OverscrollAreaTypes.RIGHT,
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
                    type: OverscrollAreaTypes.TOP,
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
                    type: OverscrollAreaTypes.BOTTOM,
                }
            };
        });

        this._leftService.$trigger.pipe(
            takeUntilDestroyed(),
            debounceTime(0),
            filter(v => validateBoolean(v)),
            tap(v => {
                this.onLeftAreaTrigger.emit(v);
            }),
        ).subscribe();

        this._topService.$trigger.pipe(
            takeUntilDestroyed(),
            debounceTime(0),
            filter(v => validateBoolean(v)),
            tap(v => {
                this.onTopAreaTrigger.emit(v);
            }),
        ).subscribe();

        this._rightService.$trigger.pipe(
            takeUntilDestroyed(),
            debounceTime(0),
            filter(v => validateBoolean(v)),
            tap(v => {
                this.onRightAreaTrigger.emit(v);
            }),
        ).subscribe();

        this._bottomService.$trigger.pipe(
            takeUntilDestroyed(),
            debounceTime(0),
            filter(v => validateBoolean(v)),
            tap(v => {
                this.onBottomAreaTrigger.emit(v);
            }),
        ).subscribe();
    }
}