import { ChangeDetectionStrategy, Component, computed, input, Signal, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, from, tap } from 'rxjs';
import { NtBaseScrollView } from '../../../nt-scroll-view/base';
import { ScrollBox } from '../../../nt-scroller/utils';
import { SCROLL_VIEW_INVERSION, SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO, SCROLL_VIEW_OVERSCROLL_ENABLED } from '../../../../../common';
import { LEFT_PROP_NAME, TOP_PROP_NAME } from '../../../../../common/const/base-prop-names';
import { NtBaseScrollBarComponent } from '../../../../../scroll-bar/components/nt-base-scroll-bar/nt-base-scroll-bar.component';
import { IScrollToParams } from '../../../../../common/interfaces/scroll-to-params';
import { BEHAVIOR_INSTANT } from '../../../../../common/const/behavior';
import { DEFAULT_SCROLLBAR_ENABLED } from '../../../../../common/const/scroller';

/**
 * NtPrerenderScrollerComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/components/nt-prerender-container/components/nt-prerender-scroller/nt-prerender-scroller.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-prerender-scroller',
    templateUrl: './nt-prerender-scroller.component.html',
    styleUrl: '../../../nt-scroller/nt-scroller.component.scss',
    providers: [
        { provide: SCROLL_VIEW_INVERSION, useValue: false },
        { provide: SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO, useValue: true },
        { provide: SCROLL_VIEW_OVERSCROLL_ENABLED, useValue: false },
    ],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtPrerenderScrollerComponent extends NtBaseScrollView {
    @ViewChild('scrollBar', { read: NtBaseScrollBarComponent })
    scrollBar: NtBaseScrollBarComponent | undefined;

    scrollbarEnabled = input<boolean>(DEFAULT_SCROLLBAR_ENABLED);

    classes = input<{ [cName: string]: boolean }>({});

    actualClasses: Signal<{ [cName: string]: boolean }>;

    containerClasses = signal<{ [cName: string]: boolean }>({});

    thumbSize = signal<number>(0);

    scrollbarShow = signal<boolean>(false);

    override set x(v: number) {
        if (v !== undefined && !Number.isNaN(v)) {
            this._x = this._actualX = v;

            this.updateScrollBar();
        }
    }
    override get x() { return this._x; }

    override set y(v: number) {
        if (v !== undefined && !Number.isNaN(v)) {
            this._y = this._actualY = v;

            this.updateScrollBar();
        }
    }
    override get y() { return this._y; }

    protected override onResizeViewport() {
        const viewport = this.scrollViewport()?.nativeElement;
        if (viewport) {
            this.viewportBounds.set({ width: viewport.offsetWidth, height: viewport.offsetHeight });
            this.updateScrollBar();
        }
    }

    protected override onResizeContent() {
        const content = this.scrollContent()?.nativeElement;
        if (content) {
            this.contentBounds.set({ width: content.offsetWidth, height: content.offsetHeight });
            this.updateScrollBar();
        }
    }

    private _scrollBox = new ScrollBox();

    constructor() {
        super();

        this.actualClasses = computed(() => {
            const classes = this.classes(), direction = this.direction();
            return { ...classes, [direction]: true };
        });

        const $contentBounds = toObservable(this.contentBounds),
            $viewportBounds = toObservable(this.viewportBounds),
            $isVertical = toObservable(this.isVertical),
            $direction = toObservable(this.direction),
            $scrollbarEnabled = toObservable(this.scrollbarEnabled);

        combineLatest([$direction, $scrollbarEnabled, $isVertical, $contentBounds, $viewportBounds]).pipe(
            takeUntilDestroyed(),
            tap(([direction, scrollbarEnabled]) => {
                this.containerClasses.set({ [direction]: true, enabled: scrollbarEnabled, scrollable: scrollbarEnabled });
            }),
        ).subscribe();

        const $startOffset = toObservable(this.startOffset),
            $endOffset = toObservable(this.endOffset),
            $thumbSize = toObservable(this.thumbSize);

        from([$endOffset, $startOffset, $thumbSize, $isVertical]).pipe(
            takeUntilDestroyed(),
            tap(() => {
                this.updateScrollBar();
            }),
        ).subscribe();

        const $updateScrollBar = this.$updateScrollBar;

        $updateScrollBar.pipe(
            takeUntilDestroyed(this._destroyRef),
            tap(() => {
                this.updateScrollBarHandler(true);
            }),
        ).subscribe();
    }

    private updateScrollBarHandler(update: boolean = false) {
        const direction = this.direction(),
            isVertical = this.isVertical(),
            startOffset = this.startOffset(),
            endOffset = this.endOffset(),
            scrollContent = this.scrollContent()?.nativeElement as HTMLElement,
            scrollViewport = this.scrollViewport()?.nativeElement as HTMLDivElement,
            {
                thumbSize,
                thumbPosition,
            } = this._scrollBox.calculateScroll({
                direction,
                viewportWidth: scrollViewport.offsetWidth, viewportHeight: scrollViewport.offsetHeight,
                contentWidth: scrollContent.offsetWidth, contentHeight: scrollContent.offsetHeight,
                startOffset,
                endOffset,
                positionX: this._x,
                positionY: this._y,
                minSize: 1,
            });

        this.thumbSize.set(thumbSize);
        if (update) {
            this.scrollBar?.scroll({
                [isVertical ? TOP_PROP_NAME : LEFT_PROP_NAME]: thumbPosition, fireUpdate: false, behavior: BEHAVIOR_INSTANT,
                userAction: false, blending: true,
            });
        }
        this.scrollbarShow.set(this.scrollable);
    }

    protected updateScrollBar() {
        this._$updateScrollBar.next();
    }

    override scroll(params: IScrollToParams): Array<number> | number | null {
        throw new Error('Method not implemented.');
    }
}