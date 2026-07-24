import {
    ChangeDetectionStrategy, Component, input, TemplateRef, viewChild, ViewEncapsulation,
} from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { filter, Observable, switchMap } from "rxjs";
import {
    DEFAULT_DIRECTION, DEFAULT_DIVIDES, DEFAULT_DYNAMIC_SIZE, DEFAULT_ITEM_SIZE, DEFAULT_SCROLLBAR_ENABLED, TRACK_BY_PROPERTY_NAME,
} from "../../const";
import { IVirtualListCollection } from "../../models";
import { Direction } from "../../types";
import { NtPrerenderList } from "./components/nt-prerender-list/nt-prerender-list.component";
import { PrerenderCache } from "./types";
import { ISize } from "../../../common";

/**
 * NtPrerenderContainer
 * Maximum performance for extremely large lists.
 * It is based on algorithms for virtualization of screen objects.
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/components/nt-prerender-container/nt-prerender-container.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-prerender-container',
    templateUrl: './nt-prerender-container.component.html',
    styleUrls: ['../../nt-virtual-list.component.scss', './nt-prerender-container.component.scss'],
    host: {
        'style': 'position: relative;'
    },
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class NtPrerenderContainer {
    private _list = viewChild<NtPrerenderList>('list');

    enabled = input<boolean>(false);

    direction = input<Direction>(DEFAULT_DIRECTION);

    isVertical = input<boolean>(true);

    scrollbarEnabled = input<boolean>(DEFAULT_SCROLLBAR_ENABLED);

    startOffset = input<number>(0);

    endOffset = input<number>(0);

    bounds = input.required<ISize>();

    dynamic = input<boolean>(DEFAULT_DYNAMIC_SIZE);

    itemSize = input<number>(DEFAULT_ITEM_SIZE);

    trackBy = input<string>(TRACK_BY_PROPERTY_NAME);

    divides = input<number>(DEFAULT_DIVIDES);

    itemRenderer = input<TemplateRef<any>>();

    readonly $render: Observable<PrerenderCache>;

    get active() {
        return this._list()?.active ?? false;
    }

    constructor() {
        const $list = toObservable(this._list);

        this.$render = $list.pipe(
            takeUntilDestroyed(),
            filter(v => !!v),
            switchMap(v => v.$render),
        );
    }

    clear() {
        const list = this._list();
        if (!!list) {
            list.clear();
        }
    }

    on(items: IVirtualListCollection | null = null) {
        const list = this._list();
        if (!!list) {
            list.on(items);
        }
    }

    off() {
        const list = this._list();
        if (!!list) {
            list.off();
        }
    }
}