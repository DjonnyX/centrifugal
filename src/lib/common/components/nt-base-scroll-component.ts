import { Component, inject, signal, viewChild } from "@angular/core";
import { SCROLL_VIEW_SERVICE } from "../injection";
import { IBaseScrollViewService } from "../interfaces/base-scroll-view-service";
import { IBaseScrollView } from "../interfaces/base-scroll-view";
import { ISize } from "../interfaces";
import { INtScroller } from "../interfaces/nt-scroller";

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
export class NtBaseScrollComponent<S extends IBaseScrollViewService, P extends IBaseScrollViewService, C = INtScroller<S>>
    implements IBaseScrollView<S, P, C> {
    private static __nextId: number = 0;

    protected _id: number = NtBaseScrollComponent.__nextId;

    /**
     * Readonly. Returns the unique identifier of the component.
     */
    get id() { return this._id; }

    protected _service = inject<S>(SCROLL_VIEW_SERVICE);

    get service() { return this._service; }

    protected _parentService: P | null = null;

    get parentService() { return this._parentService; }

    protected _scrollerComponent = viewChild<C | undefined>('scroller');
    get component(): C | undefined { return this._scrollerComponent(); }

    protected _bounds = signal<ISize | null>(null);
    get bounds(): ISize { return this._bounds() ?? { width: 0, height: 0 }; }

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