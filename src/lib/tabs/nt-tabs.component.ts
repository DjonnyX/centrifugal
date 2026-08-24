import { Component, computed, DestroyRef, effect, ElementRef, inject, input, output, signal, Signal, TemplateRef, viewChild, ViewEncapsulation } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { filter, switchMap, tap } from "rxjs";
import { Directions, Id, IScrollingSettings, ISize, TextDirection, TextDirections } from "../common";
import { toggleClassName, validateArray, validateBoolean, validateFloat, validateObject, validateString } from "../common/utils";
import { SDirection } from "../core/nt-s-scroller/types";
import { DEFAULT_ANIMATION_PARAMS, DEFAULT_SCROLLING_SETTINGS, DEFAULT_SWITCH_DIRECTION, TRACK_BY_PROPERTY_NAME } from './const';
import { PX } from "../common/const/base-prop-names";
import { NtService } from "../common/services/nt.service";
import { DEFAULT_LANG_TEXT_DIR, DEFAULT_MAX_MOTION_BLUR, DEFAULT_MOTION_BLUR, DEFAULT_MOTION_BLUR_ENABLED } from "../common/const/scroller";
import { INtListAnimationParams, IVirtualListCollection, NtListComponent } from "../list";
import { matrix3d } from "../common/utils/matrix-3d";
import { ITabsTemplateContext } from "./interfaces";

/**
 * NtTabsComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/tabs/nt-tabs.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-tabs',
    standalone: false,
    encapsulation: ViewEncapsulation.ShadowDom,
    templateUrl: './nt-tabs.component.html',
    styleUrl: './nt-tabs.component.scss'
})
export class NtTabsComponent {
    protected _list = viewChild<NtListComponent>('list');

    protected _thumb = viewChild<ElementRef<HTMLDivElement>>('thumb');

    /**
     * Triggers an event when the value changes.
     */
    readonly onChange = output<Id | null>();

    protected _selectedIdOptions = {
        transform: (v: Id | undefined) => {
            const valid = validateString(v as any, true, true) || validateFloat(v as any, true);
            if (!valid) {
                console.error('The "selectedId" parameter must be of type `Id` or `null`.');
                return undefined;
            }
            return v;
        },
    } as any;

    /**
     * Sets the selected item.
     */
    selectedId = input<Id | null>(null, { ...this._selectedIdOptions });

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

    protected _scrollingSettingsOptions = {
        transform: (v: IScrollingSettings): IScrollingSettings | null => {
            let valid = validateObject(v, true, true);
            if (valid && !!v) {
                const { frictionalForce, mass, maxDistance, maxDuration, speedScale, breakpointStoppingFactor, optimization } = v;
                valid = validateFloat(frictionalForce, true);
                if (!valid) {
                    console.error('The "frictionalForce" parameter must be of type `number` or `undefined`.');
                    return DEFAULT_SCROLLING_SETTINGS;
                }
                valid = validateFloat(mass, true);
                if (!valid) {
                    console.error('The "mass" parameter must be of type `number` or `undefined`.');
                    return DEFAULT_SCROLLING_SETTINGS;
                }
                valid = validateFloat(maxDistance, true);
                if (!valid) {
                    console.error('The "maxDistance" parameter must be of type `number` or `undefined`.');
                    return DEFAULT_SCROLLING_SETTINGS;
                }
                valid = validateFloat(maxDuration, true);
                if (!valid) {
                    console.error('The "maxDuration" parameter must be of type `number` or `undefined`.');
                    return DEFAULT_SCROLLING_SETTINGS;
                }
                valid = validateFloat(speedScale, true);
                if (!valid) {
                    console.error('The "speedScale" parameter must be of type `number` or `undefined`.');
                    return DEFAULT_SCROLLING_SETTINGS;
                }
                valid = validateFloat(breakpointStoppingFactor, true);
                if (!valid) {
                    console.error('The "breakpointStoppingFactor" parameter must be of type `number` or `undefined`.');
                    return DEFAULT_SCROLLING_SETTINGS;
                }
                valid = validateBoolean(optimization, true);
                if (!valid) {
                    console.error('The "optimization" parameter must be of type `boolean` or `undefined`.');
                    return DEFAULT_SCROLLING_SETTINGS;
                }
            }
            if (!valid) {
                console.error('The "scrollingSettings" parameter must be of type `object` or null.');
                return DEFAULT_SCROLLING_SETTINGS;
            }
            return {
                frictionalForce: v.frictionalForce !== undefined && v.frictionalForce > 0 ? v.frictionalForce : DEFAULT_SCROLLING_SETTINGS.frictionalForce,
                mass: v.mass !== undefined && v.mass > 0 ? v.mass : DEFAULT_SCROLLING_SETTINGS.mass,
                maxDistance: v.maxDistance !== undefined && v.maxDistance > 0 ? v.maxDistance : DEFAULT_SCROLLING_SETTINGS.maxDistance,
                maxDuration: v.maxDuration !== undefined && v.maxDuration > 0 ? v.maxDuration : DEFAULT_SCROLLING_SETTINGS.maxDuration,
                speedScale: v.speedScale !== undefined && v.speedScale > 0 ? v.speedScale : DEFAULT_SCROLLING_SETTINGS.speedScale,
                breakpointStoppingFactor: v.breakpointStoppingFactor !== undefined && v.breakpointStoppingFactor > 0 ? v.breakpointStoppingFactor : DEFAULT_SCROLLING_SETTINGS.breakpointStoppingFactor,
                optimization: v.optimization ?? DEFAULT_SCROLLING_SETTINGS.optimization,
            };
        },
    } as any;

    /**
     * Scrolling settings.
     * - frictionalForce - Frictional force. Default value is 0.035.
     * - mass - Mass. Default value is 0.005.
     * - maxDistance - Maximum scrolling distance. Default value is 100000.
     * - maxDuration - Maximum animation duration. Default value is 4000.
     * - speedScale - Speed scale. Default value is 10.
     * - breakpointStoppingFactor - Default value is 0.01.
     * - optimization - Enables scrolling performance optimization. Default value is `true`.
     */
    scrollingSettings = input<IScrollingSettings>(DEFAULT_SCROLLING_SETTINGS, { ...this._scrollingSettingsOptions });

    protected _animationParamsOptions = {
        transform: (v: INtListAnimationParams) => {
            const valid = validateObject(v, true, true);

            if (!validateFloat(v.scrollToItem)) {
                console.error('The "scrollToItem" parameter must be of type `number`.');
                return DEFAULT_ANIMATION_PARAMS;
            }
            if (!validateFloat(v.snapToItem)) {
                console.error('The "snapToItem" parameter must be of type `number`.');
                return DEFAULT_ANIMATION_PARAMS;
            }
            if (!validateFloat(v.navigateByKeyboard)) {
                console.error('The "navigateByKeyboard" parameter must be of type `number`.');
                return DEFAULT_ANIMATION_PARAMS;
            }
            if (!validateFloat(v.navigateToItem)) {
                console.error('The "navigateToItem" parameter must be of type `number`.');
                return DEFAULT_ANIMATION_PARAMS;
            }
            if (!valid) {
                console.error('The "animationParams" parameter must be of type `object`.');
                return DEFAULT_ANIMATION_PARAMS;
            }
            return v;
        },
    } as any;

    /**
     * Animation parameters. The default value is "{ scrollToItem: 150, snapToItem: 150, navigateToItem: 150, navigateByKeyboard: 50 }".
     */
    animationParams = input<INtListAnimationParams>(DEFAULT_ANIMATION_PARAMS, { ...this._animationParamsOptions });

    protected _trackByOptions = {
        transform: (v: string) => {
            const valid = validateString(v);
            if (!valid) {
                console.error('The "trackBy" parameter must be of type `string`.');
                return TRACK_BY_PROPERTY_NAME;
            }
            return v;
        },
    } as any;

    /**
     * The name of the property by which tracking is performed
     */
    trackBy = input<string>(TRACK_BY_PROPERTY_NAME, { ...this._trackByOptions });

    protected _itemRendererOptions = {
        transform: (v: TemplateRef<any>) => {
            let valid = validateObject(v);
            if (v && !(typeof v.elementRef === 'object' && typeof v.createEmbeddedView === 'function')) {
                valid = false;
            }

            if (!valid) {
                throw Error('The "itemRenderer" parameter must be of type `TemplateRef`.');
            }
            return v;
        },
    } as any;

    /**
     * Rendering element template.
     */
    itemRenderer = input.required<TemplateRef<any>>({ ...this._itemRendererOptions });

    protected _itemRenderer = signal<TemplateRef<any> | undefined>(undefined);

    protected _itemsOptions = {
        transform: (v: IVirtualListCollection | undefined) => {
            let valid = validateArray(v, true, true);
            if (valid) {
                if (v) {
                    const trackBy = this.trackBy();
                    for (let i = 0, l = v.length; i < l; i++) {
                        const item = v[i];
                        valid = validateObject(item, true, true);
                        if (valid) {
                            if (item && !(validateFloat(item?.[trackBy] as number, true) || validateString(item?.[trackBy] as string, true, true))) {
                                valid = false;
                                break;
                            }
                        }
                    }
                }
            }

            if (!valid) {
                console.error('The "items" parameter must be of type `IVirtualListCollection` or `undefined`.');
                return [];
            }
            return v;
        },
    } as any;

    /**
     * Collection of list items.
     */
    items = input.required<IVirtualListCollection>({
        ...this._itemsOptions,
    });

    protected _valueOptions = {
        transform: (v: Id | null) => {
            const valid = validateString(v as any, true, true) || validateFloat(v as any, true);
            if (!valid) {
                console.error('The "value" parameter must be one of type `Id` or `null`.');
                return null;
            }
            return v;
        },
    } as any;

    /**
     * Tabs value. Default value is `null`.
     */
    value = input<Id | null>(null, { ...this._valueOptions });

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
     * Determines the switch direction. Default value is "vertical".
     */
    direction = input<SDirection>(DEFAULT_SWITCH_DIRECTION, { ...this._directionOptions });

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

    protected _motionBlurOptions = {
        transform: (v: number) => {
            const valid = validateFloat(v);

            if (!valid) {
                console.error('The "motionBlur" parameter must be of type `number`.');
                return DEFAULT_MOTION_BLUR;
            }
            return v;
        },
    } as any;

    /**
     * Motion blur effect. The default value is `0.15`.
     */
    motionBlur = input<number>(DEFAULT_MOTION_BLUR, { ...this._motionBlurOptions });

    protected _maxMotionBlurOptions = {
        transform: (v: number) => {
            const valid = validateFloat(v);

            if (!valid) {
                console.error('The "maxMotionBlur" parameter must be of type `number`.');
                return DEFAULT_MAX_MOTION_BLUR;
            }
            return v <= 0 ? DEFAULT_MAX_MOTION_BLUR : v;
        },
    } as any;

    /**
     * Maximum motion blur effect. The default value is `0.5`.
     */
    maxMotionBlur = input<number>(DEFAULT_MAX_MOTION_BLUR, { ...this._maxMotionBlurOptions });

    protected _motionBlurEnabledOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);

            if (!valid) {
                console.error('The "motionBlurEnabled" parameter must be of type `boolean`.');
                return DEFAULT_MOTION_BLUR_ENABLED;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether to apply motion blur or not. The default value is `false`.
     */
    motionBlurEnabled = input<boolean>(DEFAULT_MOTION_BLUR_ENABLED, { ...this._motionBlurEnabledOptions });

    /**
     * Extra parameters that will be passed to the custom thumb renderer.
     */
    readonly params = input<{ [propName: string]: any } | null>({});

    /**
     * Custom thumb renderer.
     */
    readonly renderer = input<TemplateRef<any> | null>(null);

    protected readonly _templateContext!: Signal<ITabsTemplateContext>;

    get scrollLeft(): number {
        return this._list()?.scrollLeft ?? 0;
    }

    get scrollTop(): number {
        return this._list()?.scrollTop ?? 0;
    }

    get scrollWidth(): number {
        return this._list()?.scrollWidth ?? 0;
    }

    get scrollHeight(): number {
        return this._list()?.scrollHeight ?? 0;
    }

    protected _selectedId = signal<Id | null>(null);

    protected _isVertical: Signal<boolean>;

    protected _containerClass: Signal<{ [cName: string]: boolean; }>;

    protected _thumbStyle: Signal<{ [sName: string]: string }>;

    protected _elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);

    protected _bounds = signal<ISize>({
        width: this._elementRef.nativeElement.offsetWidth,
        height: this._elementRef.nativeElement.offsetHeight,
    });

    protected _listSize = signal<ISize>({
        width: this._elementRef.nativeElement.offsetWidth,
        height: this._elementRef.nativeElement.offsetHeight,
    });

    protected _service = inject(NtService);

    protected _destroyRef = inject(DestroyRef);

    constructor() {
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

        effect(() => {
            const id = this.value();
            this._selectedId.set(id);
        });

        effect(() => {
            const list = this._list(), id = this._selectedId();
            if (!!list && id !== null) {
                const thumb = this._thumb()?.nativeElement, isVertical = this._isVertical();
                if (!!thumb) {
                    const list = this._list();
                    if (!!list) {
                        const isRTL = this.langTextDir() === TextDirections.RTL,
                            contentBounds = list?.component?.contentBounds() ?? { width: 0, height: 0 },
                            itemBounds = list.getItemBounds(id), position = list.getDisplayItemPosition(id);
                        if (!!itemBounds && !!position) {
                            if (isVertical) {
                                thumb.style.transform = matrix3d(0, position.y, 0, 1, 1, 1, 0, 0, 0);
                                thumb.style.height = `${itemBounds.height}${PX}`;
                            } else {
                                thumb.style.transform = matrix3d(isRTL ? (position.x - contentBounds.width + itemBounds.width) : position.x, 0, 0, 1, 1, 1, 0, 0, 0);
                                thumb.style.width = `${itemBounds.width}${PX}`;
                            }
                        }
                    }
                }
            }
        })

        this._templateContext = computed(() => {
            const list = this._list(), id = this._selectedId();
            if (!!list && id !== null) {
                if (id !== null) {
                    const itemBounds = list.getItemBounds(id) ?? { width: 0, height: 0 },
                        context: ITabsTemplateContext = {
                            width: itemBounds.width,
                            height: itemBounds.height,
                            params: this.params() ?? {},
                        };
                    return context;
                }
            }
            return {
                width: 0,
                height: 0,
                params: this.params() ?? {},
            }
        });

        this._thumbStyle = computed(() => {
            return {
                position: 'absolute',
                transition: `transform 250ms ease-out, width 250ms ease-out, height 250ms ease-out`,
                overflow: 'hidden',
            };
        });

        this._containerClass = computed(() => {
            return { [this.direction()]: true };
        });

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

        const $list = toObservable(this._list),
            $listContentBounds = $list.pipe(
                takeUntilDestroyed(),
                filter(v => !!v && !!v.component),
                switchMap(list => list!.component!.$resizeContent),
            );

        $listContentBounds.pipe(
            takeUntilDestroyed(),
            tap(v => {
                this._listSize.set({ ...v });
            }),
        ).subscribe();
    }

    protected onSelectHandler(value: Array<Id> | Id | null) {
        const id = value as Id | null;
        this._selectedId.set(id);
        this.onChange.emit(id);
    }

    protected onChangeHandler(id: Id | null) {
        this.onChange.emit(id);
    }

    protected onVirtualClickHandler(e: PointerEvent | TouchEvent) {

    }
}
