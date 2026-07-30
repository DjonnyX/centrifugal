import { Component, inject } from "@angular/core";
import { SCROLL_VIEW_SERVICE } from "../injection";

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
export class NtBaseScrollComponent<S> {
    private static __nextId: number = 0;

    protected _id: number = NtBaseScrollComponent.__nextId;

    /**
     * Readonly. Returns the unique identifier of the component.
     */
    get id() { return this._id; }

    protected _service = inject<S>(SCROLL_VIEW_SERVICE);

    protected _parentService = inject<S>(SCROLL_VIEW_SERVICE, { skipSelf: true });

    constructor() {
        NtBaseScrollComponent.__nextId = NtBaseScrollComponent.__nextId + 1 === Number.MAX_SAFE_INTEGER
            ? 0 : NtBaseScrollComponent.__nextId + 1;
        this._id = NtBaseScrollComponent.__nextId;
    }
}