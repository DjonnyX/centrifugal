import { Component, computed, DestroyRef, ElementRef, inject, input, output, signal, Signal, TemplateRef, viewChild } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { combineLatest, debounceTime, filter, skip, switchMap, tap } from "rxjs";
import { IOverscrollEvent, ISize, OverscrollAreaTypes } from "../../../../common";
import { OverscrollAreaType } from "../../../../common/types/overscroll-area-type";
import { HEIGHT_PROP_NAME, PX, WIDTH_PROP_NAME, ZERO } from "../../../../common/const/base-prop-names";
import { NT_OVERSCROLL_AREA_PART } from "./const";
import { INtOverscrollAreaPublicApi } from "../interfaces";

/**
 * NtOverscrollAreaComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-overscroll-area/base/nt-base-overscroll-area.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-base-overscroll-area',
    template: '',
    standalone: false,
})
export abstract class NtBaseOverscrollAreaComponent {
    private _rect = viewChild<ElementRef<HTMLDivElement>>('rect');

    readonly pinnable = signal<boolean>(false);

    readonly onTrigger = output<boolean>();

    readonly api = input<INtOverscrollAreaPublicApi & { trigger: (v: boolean) => void; } | null>(null);

    readonly bounds = input<ISize>({ width: 0, height: 0 });

    readonly type = input.required<OverscrollAreaType>();

    readonly leftOffset = input<number>(0);

    readonly topOffset = input<number>(0);

    readonly rightOffset = input<number>(0);

    readonly bottomOffset = input<number>(0);

    readonly renderer = input<TemplateRef<any> | null>(null);

    readonly overscrollEvent = input<IOverscrollEvent | null>(null);

    protected _classes: Signal<{ [className: string]: boolean }>;

    protected _part: Signal<string>;

    protected _position: Signal<number>;

    protected _enabled: Signal<boolean>;

    protected _offset: Signal<number>;

    protected _pinned = signal<boolean>(false);

    protected _styles: Signal<{ [styleName: string]: string }>;

    protected _containerStyles: Signal<{ [styleName: string]: string }>;

    protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    protected _destroyRef = inject(DestroyRef);

    constructor() {
        const $api = toObservable(this.api);
        $api.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            switchMap(api => {
                return api.$trigger.pipe(
                    takeUntilDestroyed(this._destroyRef),
                    tap(v => {
                        this._pinned.set(v);
                    }),
                );
            }),
        ).subscribe();

        this._classes = computed(() => {
            return { [this.type()]: true, grabbing: this.overscrollEvent()?.grabbing ?? false };
        });

        this._part = computed(() => {
            return `${NT_OVERSCROLL_AREA_PART}${this.type()}`;
        });

        this._enabled = computed(() => {
            const type = this.type(), overscrollEvent = this.overscrollEvent();
            let enabled = false;
            switch (type) {
                case OverscrollAreaTypes.LEFT: {
                    enabled = overscrollEvent?.positionX === 0;
                    break;
                }
                case OverscrollAreaTypes.RIGHT: {
                    enabled = overscrollEvent?.positionX === 1;
                    break;
                }
                case OverscrollAreaTypes.BOTTOM: {
                    enabled = overscrollEvent?.positionY === 1;
                    break;
                }
                case OverscrollAreaTypes.TOP:
                default: {
                    enabled = overscrollEvent?.positionY === 0;
                    break;
                }
            }
            return enabled;
        });

        this._offset = computed(() => {
            const type = this.type();
            let offset = 0;
            switch (type) {
                case OverscrollAreaTypes.LEFT: {
                    offset = this.leftOffset();
                    break;
                }
                case OverscrollAreaTypes.RIGHT: {
                    offset = this.rightOffset();
                    break;
                }
                case OverscrollAreaTypes.BOTTOM: {
                    offset = this.bottomOffset();
                    break;
                }
                case OverscrollAreaTypes.TOP:
                default: {
                    offset = this.topOffset();
                    break;
                }
            }
            return offset;
        });

        this._position = computed(() => {
            const enabled = this._enabled(),
                type = this.type(),
                isVertical = type === OverscrollAreaTypes.TOP || type === OverscrollAreaTypes.BOTTOM,
                size = isVertical ? (this._rect()?.nativeElement?.offsetHeight ?? 0) : (this._rect()?.nativeElement?.offsetWidth ?? 0);
            if (!enabled) {
                return -size;
            }
            const overscrollEvent = this.overscrollEvent(),
                offset = this._offset(),
                pos = (isVertical ? (overscrollEvent?.dragY ?? 0) : (overscrollEvent?.dragX ?? 0)) - size,
                pinned = this.pinnable() && this._pinned();
            return pinned ? offset : (pos >= offset ? offset : pos);
        });

        this._styles = computed(() => {
            const enabled = this._enabled();
            if (!enabled) {
                return {};
            }

            const type = this.type(),
                bounds = this.bounds(),
                isVertical = type === OverscrollAreaTypes.TOP || type === OverscrollAreaTypes.BOTTOM,
                pos = this._position();
            return { [type]: `${pos}${PX}`, [isVertical ? WIDTH_PROP_NAME : HEIGHT_PROP_NAME]: `${isVertical ? bounds.width : bounds.height}${PX}` } as any;
        });

        this._containerStyles = computed(() => {
            const enabled = this._enabled();
            if (!enabled) {
                return {};
            }

            const type = this.type(), bounds = this.bounds(), leftOffset = this.leftOffset(), topOffset = this.topOffset(), rightOffset = this.rightOffset(),
                bottomOffset = this.bottomOffset(), isVertical = type === OverscrollAreaTypes.TOP || type === OverscrollAreaTypes.BOTTOM,
                size = isVertical ? (this._rect()?.nativeElement?.offsetHeight ?? 0) : (this._rect()?.nativeElement?.offsetWidth ?? 0);
            let clip: string = '', width = 0, height = 0;
            switch (type) {
                case OverscrollAreaTypes.LEFT: {
                    clip = `rect(${topOffset}${PX} ${leftOffset + size}${PX} ${bounds.height - bottomOffset}${PX} ${leftOffset}${PX})`;
                    break;
                }
                case OverscrollAreaTypes.RIGHT: {
                    clip = `rect(${topOffset}${PX} ${size}${PX} ${bounds.height - bottomOffset}${PX} ${ZERO}${PX})`;
                    width = rightOffset + size;
                    break;
                }
                case OverscrollAreaTypes.BOTTOM: {
                    clip = `rect(${ZERO}${PX} ${bounds.width - rightOffset}${PX} ${size}${PX} ${leftOffset}${PX})`;
                    height = bottomOffset + size;
                    break;
                }
                case OverscrollAreaTypes.TOP:
                default: {
                    clip = `rect(${topOffset}${PX} ${bounds.width - rightOffset}${PX} ${topOffset + size}${PX} ${leftOffset}${PX})`;
                    break;
                }
            }
            return { clipPath: clip, width: `${width}${PX}`, height: `${height}${PX}` } as any;
        });

        const $pos = toObservable(this._position),
            $offset = toObservable(this._offset);
        combineLatest([$api, $pos, $offset]).pipe(
            takeUntilDestroyed(),
            skip(1),
            debounceTime(50),
            tap(([api, pos, offset]) => {
                api?.trigger(pos >= offset);
            }),
        ).subscribe();
    }
}