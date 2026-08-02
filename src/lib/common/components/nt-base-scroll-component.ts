import { Component, ElementRef, inject, input, output, signal, TemplateRef, viewChild } from "@angular/core";
import { SCROLL_VIEW_SERVICE } from "../injection";
import { INtBaseScrollViewService } from "../interfaces/nt-base-scroll-view-service";
import { INtBaseScrollView } from "../interfaces/nt-base-scroll-view";
import { IOverscrollEvent, ISize } from "../interfaces";
import { INtScroller } from "../interfaces/nt-scroller";
import { validateBoolean, validateObject } from "../utils";

@Component({
    selector: 'nt-base-scroll-component',
    template: '',
})
/**
 * NtBaseScrollComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/components/nt-base-scroll.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export abstract class NtBaseScrollComponent<S extends INtBaseScrollViewService, P extends INtBaseScrollViewService, C = INtScroller<S>>
    implements INtBaseScrollView<S, P, C> {
    private static __nextId: number = 0;

    protected _id: number = NtBaseScrollComponent.__nextId;

    /**
     * Readonly. Returns the unique identifier of the component.
     */
    get id() { return this._id; }

    protected _service = inject<S>(SCROLL_VIEW_SERVICE);

    get service() { return this._service; }

    protected _parentService = inject<P | null>(SCROLL_VIEW_SERVICE, { skipSelf: true, optional: true });

    get parentService() { return this._parentService; }

    protected _scrollerComponent = viewChild<C | undefined>('scroller');
    get component(): C | undefined { return this._scrollerComponent(); }

    /**
     * Dispatches an overscroll event.
     */
    onOverscroll = output<IOverscrollEvent>();

    /**
     * Fires when the left overscroll indicator is pinned to the screen.
     */
    onLeftOverscrollIndiatorPinned = output<boolean>();

    /**
     * Fires when the top overscroll indicator is pinned to the screen.
     */
    onTopOverscrollIndiatorPinned = output<boolean>();

    /**
     * Fires when the right overscroll indicator is pinned to the screen.
     */
    onRightOverscrollIndiatorPinned = output<boolean>();

    /**
     * Fires when the bottom overscroll indicator is pinned to the screen.
     */
    onBottomOverscrollIndiatorPinned = output<boolean>();

    protected _overscrollIndicatorShowAutomaticallyOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);

            if (!valid) {
                console.error('The "overscrollIndicatorShowAutomatically" parameter must be of type `boolean`.');
                return true;
            }
            return v;
        },
    } as any;

    /**
     *  Sets whether overscroll indicators are automatically displayed if the value is true.
     */
    overscrollIndicatorShowAutomatically = input<boolean>(true, { ...this._overscrollIndicatorShowAutomaticallyOptions });

    protected _overscrollIndicatorUseOffsetsOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);

            if (!valid) {
                console.error('The "overscrollIndicatorUseOffsets" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     *  If true, scrollLeftOffset, scrollTopOffset, scrollRightOffset, and scrollBottomOffset will be used when calculating the re-scroll indicator positions.
     */
    overscrollIndicatorUseOffsets = input<boolean>(false, { ...this._overscrollIndicatorUseOffsetsOptions });

    protected _overscrollIndicatorLeftEnabledOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);

            if (!valid) {
                console.error('The "overscrollIndicatorLeftEnabled" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether to display the left overscroll indicator if the parameter value is true or not if it is false. 
     * If the overscrollIndicatorShowAutomatically property is set to true and overscrollIndicatorLeftEnabled="false", the indicator will be used if horizontal scrolling is available.
     */
    overscrollIndicatorLeftEnabled = input<boolean>(false, { ...this._overscrollIndicatorLeftEnabledOptions });

    protected _overscrollIndicatorTopEnabledOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);

            if (!valid) {
                console.error('The "overscrollIndicatorTopEnabled" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether to display the top overscroll indicator if the parameter value is true or not if it is false. 
     * If the overscrollIndicatorShowAutomatically property is set to true and overscrollIndicatorTopEnabled="false", the indicator will be used if vertical scrolling is available.
     */
    overscrollIndicatorTopEnabled = input<boolean>(false, { ...this._overscrollIndicatorTopEnabledOptions });

    protected _overscrollIndicatorRightEnabledOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);

            if (!valid) {
                console.error('The "overscrollIndicatorRightEnabled" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether to display the right overscroll indicator if the parameter value is true or not if it is false. 
     * If the overscrollIndicatorShowAutomatically property is set to true and overscrollIndicatorRightEnabled="false", the indicator will be used if horizontal scrolling is available.
     */
    overscrollIndicatorRightEnabled = input<boolean>(false, { ...this._overscrollIndicatorRightEnabledOptions });

    protected _overscrollIndicatorBottomEnabledOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);

            if (!valid) {
                console.error('The "overscrollIndicatorBottomEnabled" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether to display the bottom overscroll indicator if the parameter value is true or not if it is false. 
     * If the overscrollIndicatorShowAutomatically property is set to true and overscrollIndicatorBottomEnabled="false", the indicator will be used if vertical scrolling is available.
     */
    overscrollIndicatorBottomEnabled = input<boolean>(false, { ...this._overscrollIndicatorBottomEnabledOptions });

    protected _overscrollIndicatorLeftRendererOptions = {
        transform: (v: TemplateRef<any> | null) => {
            const valid = validateObject(v, true, true);

            if (!valid) {
                console.error('The "overscrollIndicatorLeftRenderer" parameter must be of type `TemplateRef<any>`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Specifies a custom template for the left overscroll indicator.
     */
    overscrollIndicatorLeftRenderer = input<TemplateRef<any> | null>(null, { ...this._overscrollIndicatorLeftRendererOptions });

    protected _overscrollIndicatorTopRendererOptions = {
        transform: (v: TemplateRef<any> | null) => {
            const valid = validateObject(v, true, true);

            if (!valid) {
                console.error('The "overscrollIndicatorTopRenderer" parameter must be of type `TemplateRef<any>`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Specifies a custom template for the top overscroll indicator.
     */
    overscrollIndicatorTopRenderer = input<TemplateRef<any> | null>(null, { ...this._overscrollIndicatorTopRendererOptions });

    protected _overscrollIndicatorRightRendererOptions = {
        transform: (v: TemplateRef<any> | null) => {
            const valid = validateObject(v, true, true);

            if (!valid) {
                console.error('The "overscrollIndicatorRightRenderer" parameter must be of type `TemplateRef<any>`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Specifies a custom template for the right overscroll indicator.
     */
    overscrollIndicatorRightRenderer = input<TemplateRef<any> | null>(null, { ...this._overscrollIndicatorRightRendererOptions });

    protected _overscrollIndicatorBottomRendererOptions = {
        transform: (v: TemplateRef<any> | null) => {
            const valid = validateObject(v, true, true);

            if (!valid) {
                console.error('The "overscrollIndicatorBottomRenderer" parameter must be of type `TemplateRef<any>`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Specifies a custom template for the bottom overscroll indicator.
     */
    overscrollIndicatorBottomRenderer = input<TemplateRef<any> | null>(null, { ...this._overscrollIndicatorBottomRendererOptions });

    protected _bounds = signal<ISize | null>(null);
    get bounds(): ISize { return this._bounds() ?? { width: 0, height: 0 }; }

    protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    get host() {
        return this._elementRef?.nativeElement || null;
    }

    get scrollLeft(): number {
        return (this.component as INtScroller<S>)?.scrollLeft ?? 0;
    }

    get scrollTop(): number {
        return (this.component as INtScroller<S>)?.scrollTop ?? 0;
    }

    get scrollWidth(): number {
        return (this.component as INtScroller<S>)?.scrollWidth ?? 0;
    }

    get scrollHeight(): number {
        return (this.component as INtScroller<S>)?.scrollHeight ?? 0;
    }

    constructor() {
        NtBaseScrollComponent.__nextId = NtBaseScrollComponent.__nextId + 1 === Number.MAX_SAFE_INTEGER
            ? 0 : NtBaseScrollComponent.__nextId + 1;
        this._id = NtBaseScrollComponent.__nextId;
    }
}