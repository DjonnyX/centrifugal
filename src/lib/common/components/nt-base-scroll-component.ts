import { Component, input, output, TemplateRef, viewChild } from "@angular/core";
import { INtBaseScrollViewService } from "../interfaces/nt-base-scroll-view-service";
import { INtBaseScrollView } from "../interfaces/nt-base-scroll-view";
import { IOverscrollEvent } from "../interfaces";
import { INtScroller } from "../interfaces/nt-scroller";
import { validateBoolean, validateObject } from "../utils";
import { BEHAVIOR_INSTANT } from "../const/behavior";
import { INtOverscrollService } from "../interfaces/nt-overscroll-service";
import { NtBaseComponent } from './nt-base-component';

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
export abstract class NtBaseScrollComponent<S extends INtBaseScrollViewService, P extends INtBaseScrollViewService, C = INtScroller<S>> extends NtBaseComponent<S, P>
    implements INtBaseScrollView<S, P, C> {

    protected _scrollerComponent = viewChild<C | undefined>('scroller');
    get component(): C | undefined { return this._scrollerComponent(); }

    /**
     * Dispatches an overscroll event.
     */
    onOverscroll = output<IOverscrollEvent>();

    /**
     * Fires when the left overscroll area has reached its position limit.
     */
    onLeftOverscrollAreaTrigger = output<boolean>();

    /**
     * Fires when the top overscroll area has reached its position limit.
     */
    onTopOverscrollAreaTrigger = output<boolean>();

    /**
     * Fires when the right overscroll area has reached its position limit.
     */
    onRightOverscrollAreaTrigger = output<boolean>();

    /**
     * Fires when the bottom overscroll area has reached its position limit.
     */
    onBottomOverscrollAreaTrigger = output<boolean>();

    readonly overscrollService = input<INtOverscrollService | null>(null);

    protected _overscrollAreaShowAutomaticallyOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);

            if (!valid) {
                console.error('The "overscrollAreaShowAutomatically" parameter must be of type `boolean`.');
                return true;
            }
            return v;
        },
    } as any;

    /**
     *  Sets whether overscroll areas are automatically displayed if the value is true.
     */
    overscrollAreaShowAutomatically = input<boolean>(true, { ...this._overscrollAreaShowAutomaticallyOptions });

    protected _overscrollAreaUseOffsetsOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);

            if (!valid) {
                console.error('The "overscrollAreaUseOffsets" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     *  If true, scrollLeftOffset, scrollTopOffset, scrollRightOffset, and scrollBottomOffset will be used when calculating the re-scroll indicator positions.
     */
    overscrollAreaUseOffsets = input<boolean>(false, { ...this._overscrollAreaUseOffsetsOptions });

    protected _overscrollAreaLeftEnabledOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);

            if (!valid) {
                console.error('The "overscrollAreaLeftEnabled" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether to display the left overscroll area if the parameter value is true or not if it is false. 
     * If the overscrollAreaShowAutomatically property is set to true and overscrollAreaLeftEnabled="false", the indicator will be used if horizontal scrolling is available.
     */
    overscrollAreaLeftEnabled = input<boolean>(false, { ...this._overscrollAreaLeftEnabledOptions });

    protected _overscrollAreaTopEnabledOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);

            if (!valid) {
                console.error('The "overscrollAreaTopEnabled" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether to display the top overscroll area if the parameter value is true or not if it is false. 
     * If the overscrollAreaShowAutomatically property is set to true and overscrollAreaTopEnabled="false", the indicator will be used if vertical scrolling is available.
     */
    overscrollAreaTopEnabled = input<boolean>(false, { ...this._overscrollAreaTopEnabledOptions });

    protected _overscrollAreaRightEnabledOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);

            if (!valid) {
                console.error('The "overscrollAreaRightEnabled" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether to display the right overscroll area if the parameter value is true or not if it is false. 
     * If the overscrollAreaShowAutomatically property is set to true and overscrollAreaRightEnabled="false", the indicator will be used if horizontal scrolling is available.
     */
    overscrollAreaRightEnabled = input<boolean>(false, { ...this._overscrollAreaRightEnabledOptions });

    protected _overscrollAreaBottomEnabledOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);

            if (!valid) {
                console.error('The "overscrollAreaBottomEnabled" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Determines whether to display the bottom overscroll area if the parameter value is true or not if it is false. 
     * If the overscrollAreaShowAutomatically property is set to true and overscrollAreaBottomEnabled="false", the indicator will be used if vertical scrolling is available.
     */
    overscrollAreaBottomEnabled = input<boolean>(false, { ...this._overscrollAreaBottomEnabledOptions });

    protected _overscrollAreaLeftRendererOptions = {
        transform: (v: TemplateRef<any> | null) => {
            const valid = validateObject(v, true, true);

            if (!valid) {
                console.error('The "overscrollAreaLeftRenderer" parameter must be of type `TemplateRef<any>`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Specifies a custom template for the left overscroll area.
     */
    overscrollAreaLeftRenderer = input<TemplateRef<any> | null>(null, { ...this._overscrollAreaLeftRendererOptions });

    protected _overscrollAreaTopRendererOptions = {
        transform: (v: TemplateRef<any> | null) => {
            const valid = validateObject(v, true, true);

            if (!valid) {
                console.error('The "overscrollAreaTopRenderer" parameter must be of type `TemplateRef<any>`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Specifies a custom template for the top overscroll area.
     */
    overscrollAreaTopRenderer = input<TemplateRef<any> | null>(null, { ...this._overscrollAreaTopRendererOptions });

    protected _overscrollAreaRightRendererOptions = {
        transform: (v: TemplateRef<any> | null) => {
            const valid = validateObject(v, true, true);

            if (!valid) {
                console.error('The "overscrollAreaRightRenderer" parameter must be of type `TemplateRef<any>`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Specifies a custom template for the right overscroll area.
     */
    overscrollAreaRightRenderer = input<TemplateRef<any> | null>(null, { ...this._overscrollAreaRightRendererOptions });

    protected _overscrollAreaBottomRendererOptions = {
        transform: (v: TemplateRef<any> | null) => {
            const valid = validateObject(v, true, true);

            if (!valid) {
                console.error('The "overscrollAreaBottomRenderer" parameter must be of type `TemplateRef<any>`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Specifies a custom template for the bottom overscroll area.
     */
    overscrollAreaBottomRenderer = input<TemplateRef<any> | null>(null, { ...this._overscrollAreaBottomRendererOptions });

    get scrollLeft(): number {
        return (this.component as INtScroller<S>)?.scrollLeft ?? 0;
    }

    set scrollLeft(v: number) {
        const component = this.component as INtScroller<S>;
        if (!!component) {
            component.scroll({ x: v, behavior: BEHAVIOR_INSTANT, userAction: true, fireUpdate: true });
        }
    }

    get scrollTop(): number {
        return (this.component as INtScroller<S>)?.scrollTop ?? 0;
    }

    set scrollTop(v: number) {
        const component = this.component as INtScroller<S>;
        if (!!component) {
            component.scroll({ y: v, behavior: BEHAVIOR_INSTANT, userAction: true, fireUpdate: true });
        }
    }

    get scrollWidth(): number {
        return (this.component as INtScroller<S>)?.scrollWidth ?? 0;
    }

    get scrollHeight(): number {
        return (this.component as INtScroller<S>)?.scrollHeight ?? 0;
    }

    constructor() {
        super();
    }
}