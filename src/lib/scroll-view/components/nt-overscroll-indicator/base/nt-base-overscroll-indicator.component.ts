import { Component, computed, ElementRef, inject, input, output, Signal, TemplateRef, viewChild } from "@angular/core";
import { IOverscrollEvent, ISize, OverscrollIndicatorTypes } from "../../../../common";
import { OverscrollIndicatorType } from "../../../../common/types/overscroll-indicator-type";
import { HEIGHT_PROP_NAME, PX, WIDTH_PROP_NAME, ZERO } from "../../../../common/const/base-prop-names";
import { PART } from "./const";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { BehaviorSubject, combineLatest, debounceTime, skip, tap } from "rxjs";

/**
 * NtOverscrollIndicatorComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-overscroll-indicator/base/nt-base-overscroll-indicator.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-base-overscroll-indicator',
    template: '',
    standalone: false,
})
export abstract class NtBaseOverscrollIndicatorComponent {
    private _rect = viewChild<ElementRef<HTMLDivElement>>('rect');

    readonly onTrigger = output<boolean>();

    readonly bounds = input<ISize>({ width: 0, height: 0 });

    readonly type = input.required<OverscrollIndicatorType>();

    readonly leftOffset = input<number>(0);

    readonly topOffset = input<number>(0);

    readonly rightOffset = input<number>(0);

    readonly bottomOffset = input<number>(0);

    readonly renderer = input<TemplateRef<any> | null>(null);

    readonly overscrollEvent = input<IOverscrollEvent | null>(null);

    protected _classes: Signal<{ [className: string]: boolean }>;

    protected _$triggered = new BehaviorSubject<boolean>(false);
    readonly $triggered = this._$triggered.asObservable();

    protected _part: Signal<string>;

    protected _position: Signal<number>;

    protected _enabled: Signal<boolean>;

    protected _offset: Signal<number>;

    protected _styles: Signal<{ [styleName: string]: string }>;

    protected _containerStyles: Signal<{ [styleName: string]: string }>;

    protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    constructor() {
        this._classes = computed(() => {
            return { [this.type()]: true, grabbing: this.overscrollEvent()?.grabbing ?? false };
        });

        this._part = computed(() => {
            return `${PART}${this.type()}`;
        });

        this._enabled = computed(() => {
            const type = this.type(), overscrollEvent = this.overscrollEvent();
            let enabled = false;
            switch (type) {
                case OverscrollIndicatorTypes.LEFT: {
                    enabled = overscrollEvent?.positionX === 0;
                    break;
                }
                case OverscrollIndicatorTypes.RIGHT: {
                    enabled = overscrollEvent?.positionX === 1;
                    break;
                }
                case OverscrollIndicatorTypes.BOTTOM: {
                    enabled = overscrollEvent?.positionY === 1;
                    break;
                }
                case OverscrollIndicatorTypes.TOP:
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
                case OverscrollIndicatorTypes.LEFT: {
                    offset = this.leftOffset();
                    break;
                }
                case OverscrollIndicatorTypes.RIGHT: {
                    offset = this.rightOffset();
                    break;
                }
                case OverscrollIndicatorTypes.BOTTOM: {
                    offset = this.bottomOffset();
                    break;
                }
                case OverscrollIndicatorTypes.TOP:
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
                isVertical = type === OverscrollIndicatorTypes.TOP || type === OverscrollIndicatorTypes.BOTTOM,
                size = isVertical ? (this._rect()?.nativeElement?.offsetHeight ?? 0) : (this._rect()?.nativeElement?.offsetWidth ?? 0);
            if (!enabled) {
                return -size;
            }
            const overscrollEvent = this.overscrollEvent(),
                offset = this._offset(),
                pos = (isVertical ? (overscrollEvent?.dragY ?? 0) : (overscrollEvent?.dragX ?? 0)) - size;
            return pos >= offset ? offset : pos;
        });

        this._styles = computed(() => {
            const enabled = this._enabled();
            if (!enabled) {
                return {};
            }

            const type = this.type(),
                offset = this._offset(),
                bounds = this.bounds(),
                isVertical = type === OverscrollIndicatorTypes.TOP || type === OverscrollIndicatorTypes.BOTTOM,
                pos = this._position();
            return { [type]: `${pos >= offset ? offset : pos}${PX}`, [isVertical ? WIDTH_PROP_NAME : HEIGHT_PROP_NAME]: `${isVertical ? bounds.width : bounds.height}${PX}` } as any;
        });

        this._containerStyles = computed(() => {
            const enabled = this._enabled();
            if (!enabled) {
                return {};
            }

            const type = this.type(), bounds = this.bounds(), leftOffset = this.leftOffset(), topOffset = this.topOffset(), rightOffset = this.rightOffset(),
                bottomOffset = this.bottomOffset(), isVertical = type === OverscrollIndicatorTypes.TOP || type === OverscrollIndicatorTypes.BOTTOM,
                size = isVertical ? (this._rect()?.nativeElement?.offsetHeight ?? 0) : (this._rect()?.nativeElement?.offsetWidth ?? 0);
            let clip: string = '', width = 0, height = 0;
            switch (type) {
                case OverscrollIndicatorTypes.LEFT: {
                    clip = `rect(${topOffset}${PX} ${leftOffset + size}${PX} ${bounds.height - bottomOffset}${PX} ${leftOffset}${PX})`;
                    break;
                }
                case OverscrollIndicatorTypes.RIGHT: {
                    clip = `rect(${topOffset}${PX} ${size}${PX} ${bounds.height - bottomOffset}${PX} ${ZERO}${PX})`;
                    width = rightOffset + size;
                    break;
                }
                case OverscrollIndicatorTypes.BOTTOM: {
                    clip = `rect(${ZERO}${PX} ${bounds.width - rightOffset}${PX} ${size}${PX} ${leftOffset}${PX})`;
                    height = bottomOffset + size;
                    break;
                }
                case OverscrollIndicatorTypes.TOP:
                default: {
                    clip = `rect(${topOffset}${PX} ${bounds.width - rightOffset}${PX} ${topOffset + size}${PX} ${leftOffset}${PX})`;
                    break;
                }
            }
            return { clipPath: clip, width: `${width}${PX}`, height: `${height}${PX}` } as any;
        });

        const $pos = toObservable(this._position),
            $offset = toObservable(this._offset);
        combineLatest([$pos, $offset]).pipe(
            takeUntilDestroyed(),
            skip(1),
            debounceTime(50),
            tap(([pos, offset]) => {
                this._$triggered.next(pos >= offset);
            }),
        ).subscribe();

        const $triggered = this.$triggered;
        $triggered.pipe(
            takeUntilDestroyed(),
            debounceTime(0),
            tap(v => {
                this.onTrigger.emit(v);
            }),
        ).subscribe()
    }
}