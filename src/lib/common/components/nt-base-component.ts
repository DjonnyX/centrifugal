import { Component, ElementRef, inject, signal } from "@angular/core";
import { SCROLL_VIEW_SERVICE } from "../injection";
import { INtBaseScrollViewService } from "../interfaces/nt-base-scroll-view-service";
import { ISize } from "../interfaces";

@Component({
    selector: 'nt-base-scroll-component',
    template: '',
})
/**
 * NtBaseComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/components/nt-base.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export abstract class NtBaseComponent<S extends INtBaseScrollViewService, P extends INtBaseScrollViewService> {
    private static __nextId: number = 0;

    protected _id: number = NtBaseComponent.__nextId;

    /**
     * Readonly. Returns the unique identifier of the component.
     */
    get id() { return this._id; }

    protected _service = inject<S>(SCROLL_VIEW_SERVICE);

    get service() { return this._service; }

    protected _parentService = inject<P | null>(SCROLL_VIEW_SERVICE, { skipSelf: true, optional: true });

    get parentService() { return this._parentService; }

    protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    get host() {
        return this._elementRef?.nativeElement || null;
    }

    protected _bounds = signal<ISize>({
        width: this._elementRef.nativeElement.offsetWidth,
        height: this._elementRef.nativeElement.offsetHeight,
    });
    get bounds(): ISize { return this._bounds() ?? { width: 0, height: 0 }; }

    constructor() {
        NtBaseComponent.__nextId = NtBaseComponent.__nextId + 1 === Number.MAX_SAFE_INTEGER
            ? 0 : NtBaseComponent.__nextId + 1;
        this._id = NtBaseComponent.__nextId;
    }
}