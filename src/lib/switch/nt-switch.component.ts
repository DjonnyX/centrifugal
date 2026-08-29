import { Component, computed, effect, ElementRef, inject, input, output, signal, Signal, TemplateRef, viewChild, ViewEncapsulation } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { combineLatest, debounceTime, filter, of, switchMap, tap } from "rxjs";
import { Directions, ISize, OVERSCROLL_SERVICE, TextDirection, TextDirections } from "../common";
import { NtSliderComponent } from "../slider";
import { toggleClassName, validateBoolean, validateFloat, validateString } from "../common/utils";
import { SDirection } from "../core/nt-s-scroller/types";
import { DEFAULT_CONTENT_SCALE, DEFAULT_SWITCH_DIRECTION, DEFAULT_THUMB_ANIMATION_DURATION } from './const';
import { HEIGHT_PROP_NAME, PX, UNSET, WIDTH_PROP_NAME } from "../common/const/base-prop-names";
import { NtService } from "../common/services/nt.service";
import { NtOverscrollService } from "../common/services/nt-overscroll.service";
import { DEFAULT_LANG_TEXT_DIR } from "../common/const/scroller";

/**
 * NtSwitchComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/switch/nt-switch.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-switch',
    standalone: false,
    providers: [{
        provide: OVERSCROLL_SERVICE, useClass: NtOverscrollService,
    }],
    encapsulation: ViewEncapsulation.ShadowDom,
    templateUrl: './nt-switch.component.html',
    styleUrl: './nt-switch.component.scss'
})
export class NtSwitchComponent {
    protected _scroller = viewChild<NtSliderComponent>('scroller');

    protected _slider = viewChild<NtSliderComponent>('slider');

    /**
     * Triggers an event when the value changes.
     */
    readonly onChange = output<boolean>();

    protected _interactiveOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);
            if (!valid) {
                console.error('The "interactive" parameter must be of type `boolean`.');
                return true;
            }
            return v;
        },
    } as any;

    /**
     * Interactive. Default value is "true".
     */
    interactive = input<boolean>(true, { ...this._interactiveOptions });

    protected _valueOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);
            if (!valid) {
                console.error('The "value" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Switch value. Default value is `false`.
     */
    value = input<boolean>(false, { ...this._valueOptions });

    protected _directionOptions = {
        transform: (v: SDirection) => {
            const valid = validateString(v) && (v === Directions.HORIZONTAL || v === Directions.VERTICAL);
            if (!valid) {
                console.error(`The "direction" parameter must be one of type \`${Directions.HORIZONTAL}\` or \`${Directions.VERTICAL}\`.`);
                return DEFAULT_SWITCH_DIRECTION;
            }
            return v;
        },
    } as any;

    /**
     * Determines the switch direction. Default value is "horizontal".
     */
    direction = input<SDirection>(DEFAULT_SWITCH_DIRECTION, { ...this._directionOptions });

    protected _contentScaleOptions = {
        transform: (v: number) => {
            const valid = validateFloat(v);
            if (!valid) {
                console.error('The "contentScale" parameter must be of type `number`.');
                return DEFAULT_CONTENT_SCALE;
            }
            return v;
        },
    } as any;

    /**
     * Scale of content. Default value is `1.05`.
     */
    contentScale = input<number>(DEFAULT_CONTENT_SCALE, { ...this._contentScaleOptions });

    protected _thumbAnimationDurationOptions = {
        transform: (v: string) => {
            const valid = validateString(v);
            if (!valid) {
                console.error('The "thumbAnimationDuration" parameter must be of type `string`.');
                return DEFAULT_THUMB_ANIMATION_DURATION;
            }
            return v;
        },
    } as any;

    /**
     * Content scale. Default value is `150ms`.
     */
    thumbAnimationDuration = input<string>(DEFAULT_THUMB_ANIMATION_DURATION, { ...this._thumbAnimationDurationOptions });

    protected _langTextDirOptions = {
        transform: (v: TextDirection) => {
            const valid = validateString(v) && (v === TextDirections.LTR || v === TextDirections.RTL);
            if (!valid) {
                console.error('The "langTextDir" parameter must be of type `string`.');
                return DEFAULT_LANG_TEXT_DIR;
            }
            return v;
        },
    } as any;

    /**
     * A string indicating the direction of text for the locale.
     * Can be either "ltr" (left-to-right) or "rtl" (right-to-left).
     */
    langTextDir = input<TextDirection>(DEFAULT_LANG_TEXT_DIR, { ...this._langTextDirOptions });

    /**
     * Extra parameters that will be passed to the custom thumb renderer.
     */
    readonly params = input<{ [propName: string]: any } | null>({});

    /**
     * Custom thumb renderer.
     */
    readonly renderer = input<TemplateRef<any> | null>(null);

    protected _overscrollService = inject(OVERSCROLL_SERVICE);

    get scrollLeft(): number {
        return this._scroller()?.scrollLeft ?? 0;
    }

    get scrollTop(): number {
        return this._scroller()?.scrollTop ?? 0;
    }

    get scrollWidth(): number {
        return this._scroller()?.scrollWidth ?? 0;
    }

    get scrollHeight(): number {
        return this._scroller()?.scrollHeight ?? 0;
    }

    protected _sliderValue = signal<number>(0);

    protected _isVertical: Signal<boolean>;

    protected _size: Signal<number>;

    protected _thumbSize: Signal<number>;

    protected _containerClass: Signal<{ [cName: string]: boolean; }>;

    protected _contentStyle: Signal<{ [sName: string]: string }>;

    protected _scrollerContentStyle: Signal<{ [sName: string]: string }>;

    protected _elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);

    protected _bounds = signal<ISize>({
        width: this._elementRef.nativeElement.offsetWidth,
        height: this._elementRef.nativeElement.offsetHeight,
    });

    protected _service = inject(NtService);

    constructor() {
        effect(() => {
            this._sliderValue.set(this.value() === true ? 1 : 0);
        });

        this._isVertical = computed(() => {
            const direction = this.direction();
            return direction === Directions.VERTICAL;
        });

        effect(() => {
            const isVertical = this._isVertical();
            toggleClassName(this._elementRef.nativeElement,
                isVertical ? Directions.VERTICAL : Directions.HORIZONTAL,
                [isVertical ? Directions.HORIZONTAL : Directions.VERTICAL]
            );
        });

        this._size = computed(() => {
            const isVertical = this._isVertical(), bounds = this._bounds();
            return (isVertical ? bounds.height : bounds.width) * this.contentScale();
        });

        this._thumbSize = computed(() => {
            const isVertical = this._isVertical(), bounds = this._bounds();
            return (isVertical ? bounds.height : bounds.width) * .5;
        });

        this._contentStyle = computed(() => {
            const isVertical = this._isVertical(), size = this._size();
            return { [isVertical ? HEIGHT_PROP_NAME : WIDTH_PROP_NAME]: `${size}${PX}` };
        });

        this._scrollerContentStyle = computed(() => {
            const isVertical = this._isVertical(), size = this._size();
            return {
                position: 'relative', display: 'grid', 'align-items': 'center', width: '100%', height: '100%',
                [isVertical ? HEIGHT_PROP_NAME : WIDTH_PROP_NAME]: `${size}${PX}`, gridTemplateColumns: isVertical ? UNSET : '1fr 1fr',
                gridTemplateRows: isVertical ? '1fr 1fr' : UNSET,
            };
        });

        this._containerClass = computed(() => {
            return { [this.direction()]: true };
        });

        const $value = toObservable(this._sliderValue);
        $value.pipe(
            takeUntilDestroyed(),
            debounceTime(1),
            tap(v => {
                this.onChange.emit(v !== 0);
            }),
        ).subscribe();
        
        this._service.$tick.pipe(
            takeUntilDestroyed(),
            tap(() => {
                const {
                    width: viewportWidth,
                    height: viewportHeight,
                } = this._bounds(),
                    width = this._elementRef.nativeElement.offsetWidth,
                    height = this._elementRef.nativeElement.offsetHeight;
                if (viewportWidth !== width || viewportHeight !== height) {
                    this._bounds.set({ width, height });
                }
            }),
        ).subscribe();

        const $slider = toObservable(this._slider).pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
        ),
            $scroll = $slider.pipe(
                takeUntilDestroyed(),
                switchMap(s => s!.$scroll || of(undefined)),
            ),
            $scrollEnd = $slider.pipe(
                takeUntilDestroyed(),
                switchMap(s => s!.$scrollEnd || of(undefined)),
            ),
            $isVertical = toObservable(this._isVertical);

        combineLatest([$isVertical, $slider, $scroll, $scrollEnd]).pipe(
            takeUntilDestroyed(),
            tap(([isVertical, slider]) => {
                const scrollPosition = (isVertical ? slider.scrollTop : slider.scrollLeft),
                    scrollSize = (isVertical ? slider.scrollHeight : slider.scrollWidth),
                    scrollValue = scrollSize !== 0 ? (scrollPosition / scrollSize) : 0,
                    scroller = this._scroller();
                if (!!scroller) {
                    if (isVertical) {
                        scroller.scrollTop = this.scrollHeight * scrollValue;
                    } else {
                        scroller.scrollLeft = this.scrollWidth * scrollValue;
                    }
                }
            }),
        ).subscribe();
    }

    protected onChangeHandler(value: number) {
        this._sliderValue.set(value);
    }

    protected onVirtualClickHandler(e: PointerEvent | TouchEvent) {
        const slider = this._slider();
        if (!!slider) {
            const value = slider.value(), nextValue = value !== 0 ? 0 : 1;
            this._sliderValue.set(nextValue);
        }
    }
}
