import {
    Component, computed, DestroyRef, ElementRef, inject, input, output, Signal, signal, TemplateRef, viewChild,
} from '@angular/core';
import { combineLatest, debounceTime, Subject, tap } from 'rxjs';
import { ScrollerDirection, ScrollerDirections } from '../enums';
import {
    IOverscrollEvent,
    ISize, SCROLL_VIEW_INVERSION, SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE, SCROLL_VIEW_TYPE, TextDirection, TextDirections,
} from '../../../../common';
import { INtListService } from '../../../interfaces';
import { INtScroller } from '../../../../common/interfaces/nt-scroller';
import { IScrollToParams } from '../../../../common/interfaces/scroll-to-params';
import { INtBaseScrollViewService } from '../../../../common/interfaces/nt-base-scroll-view-service';
import { INtBaseScrollView } from '../../../../common/interfaces/nt-base-scroll-view';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

/**
 * NtBaseScrollView
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/components/nt-scroll-view/base/nt-base-scroll-view.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-base-scroll-view',
    template: '',
})
export abstract class NtBaseScrollView implements INtScroller<INtBaseScrollViewService> {
    protected _service = inject<INtListService>(SCROLL_VIEW_SERVICE);

    get service() { return this._service; }

    readonly scrollContent = viewChild<ElementRef<HTMLDivElement>>('scrollContent');

    readonly scrollViewport = viewChild<ElementRef<HTMLDivElement>>('scrollViewport');

    readonly onOverscroll = output<IOverscrollEvent>();

    readonly onLeftOverscrollIndiatorPinned = output<boolean>();

    readonly onTopOverscrollIndiatorPinned = output<boolean>();

    readonly onRightOverscrollIndiatorPinned = output<boolean>();

    readonly onBottomOverscrollIndiatorPinned = output<boolean>();

    readonly overscrollIndicatorShowAutomatically = input<boolean>(true);

    readonly overscrollIndicatorUseOffsets = input<boolean>(false);

    readonly overscrollIndicatorStartEnabled = input<boolean>(false);

    readonly overscrollIndicatorEndEnabled = input<boolean>(false);

    readonly overscrollIndicatorStartRenderer = input<TemplateRef<any> | null>(null);

    readonly overscrollIndicatorEndRenderer = input<TemplateRef<any> | null>(null);

    readonly direction = input<ScrollerDirections>(ScrollerDirection.VERTICAL);

    readonly startOffset = input<number>(0);

    readonly endOffset = input<number>(0);

    protected _leftOffset = signal<number>(0);

    protected _topOffset = signal<number>(0);

    protected _rightOffset = signal<number>(0);

    protected _bottomOffset = signal<number>(0);

    protected _actualOverscrollIndicatorLeftEnabled = signal<boolean>(false);

    protected _actualOverscrollIndicatorTopEnabled = signal<boolean>(false);

    protected _actualOverscrollIndicatorRightEnabled = signal<boolean>(false);

    protected _actualOverscrollIndicatorBottomEnabled = signal<boolean>(false);

    readonly alignmentStartOffset = input<number>(0);

    readonly alignmentEndOffset = input<number>(0);

    readonly isInfinity = input<boolean>(false);

    readonly isVertical: Signal<boolean>;

    readonly grabbing = signal<boolean>(false);

    readonly context = input<INtBaseScrollView<INtBaseScrollViewService, INtBaseScrollViewService> | null>(null);
    get parent() { return this.context(); }

    readonly langTextDir = input<TextDirection>(TextDirections.LTR);

    protected _type = inject(SCROLL_VIEW_TYPE, { optional: true });
    get type() { return this._type; }

    protected _inversion = inject(SCROLL_VIEW_INVERSION);

    protected _overscrollEnabled = inject(SCROLL_VIEW_OVERSCROLL_ENABLED);

    protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    protected _$overscroll = new Subject<IOverscrollEvent>();
    readonly $overscroll = this._$overscroll.asObservable();

    protected _$updateScrollBar = new Subject<void>();
    protected $updateScrollBar = this._$updateScrollBar.asObservable();

    get scrollable() {
        const { width, height } = this.viewportBounds(),
            isVertical = this.isVertical(),
            viewportSize = isVertical ? height : width,
            totalSize = this._totalSize;
        return this._inversion ? (totalSize < viewportSize) : (totalSize > viewportSize);
    }

    protected _destroyRef = inject(DestroyRef);

    protected _isMoving = false;
    get isMoving() {
        return this._isMoving;
    }

    protected _x: number = 0;
    set x(v: number) {
        this._x = this._actualX = v;

        this.normalizeScrollSize();
    }
    get x() { return this._x; }

    protected _y: number = 0;
    set y(v: number) {
        this._y = this._actualY = v;

        this.normalizeScrollSize();
    }
    get y() { return this._y; }

    protected _actualTotalSize: number = 0;
    protected _totalSize: number = 0;
    set totalSize(v: number) {
        if (this._totalSize !== v) {
            this._totalSize = v;
            const startOffset = this.startOffset(), endOffset = this.alignmentEndOffset();
            this._actualTotalSize = v + startOffset + endOffset;

            this.normalizeScrollSize();
        }
    }
    get totalSize() {
        return this._totalSize;
    }

    protected _startLayoutOffset: number = 0;
    set startLayoutOffset(v: number) {
        if (this._startLayoutOffset !== v) {
            this._startLayoutOffset = v;
        }
    }
    get startLayoutOffset() { return this._startLayoutOffset; }

    get actualScrollHeight() {
        const { height: viewportHeight } = this.viewportBounds(),
            totalSize = this._actualTotalSize,
            isVertical = this.isVertical(),
            startOffset = this.startOffset(),
            endOffset = this.endOffset();
        if (this._inversion) {
            return totalSize > viewportHeight ? isVertical ? endOffset : 0 : viewportHeight - totalSize;
        }
        return totalSize < viewportHeight ? isVertical ? startOffset : 0 : totalSize - viewportHeight;
    }

    get actualScrollWidth() {
        const { width: viewportWidth } = this.viewportBounds(),
            totalSize = this._actualTotalSize,
            isVertical = this.isVertical(),
            startOffset = this.startOffset(),
            endOffset = this.endOffset();
        if (this._inversion) {
            return totalSize > viewportWidth ? isVertical ? 0 : endOffset : viewportWidth - totalSize;
        }
        return totalSize < viewportWidth ? isVertical ? 0 : startOffset : totalSize - viewportWidth;
    }

    protected _actualX: number = 0;
    get actualScrollLeft() {
        return this._actualX;
    }

    protected _actualY: number = 0;
    get actualScrollTop() {
        return this._actualY;
    }

    get scrollLeft() {
        return this._x;
    }

    get scrollTop() {
        return this._y;
    }

    get scrollWidth() {
        const { width: viewportWidth } = this.viewportBounds(),
            { width: contentWidth } = this.contentBounds(),
            isVertical = this.isVertical(),
            startOffset = this.startOffset(),
            endOffset = this.endOffset();
        if (this._inversion) {
            return contentWidth > viewportWidth ? isVertical ? 0 : endOffset : (viewportWidth - (contentWidth + this.alignmentEndOffset()));
        }
        return contentWidth < viewportWidth ? isVertical ? 0 : startOffset : ((contentWidth + this.alignmentEndOffset()) - viewportWidth);
    }

    get scrollHeight() {
        const { height: viewportHeight } = this.viewportBounds(),
            { height: contentHeight } = this.contentBounds(),
            isVertical = this.isVertical(),
            startOffset = this.startOffset(),
            endOffset = this.endOffset();
        if (this._inversion) {
            return contentHeight > viewportHeight ? isVertical ? endOffset : 0 : (viewportHeight - (contentHeight + this.alignmentEndOffset()));
        }
        return contentHeight < viewportHeight ? isVertical ? startOffset : 0 : ((contentHeight + this.alignmentEndOffset()) - viewportHeight);
    }

    readonly viewportBounds = signal<ISize>({ width: 0, height: 0 });

    readonly contentBounds = signal<ISize>({ width: 0, height: 0 });

    protected _isCoordinatesOverrided: boolean = false;

    constructor() {
        this.isVertical = computed(() => {
            return this.direction() === ScrollerDirection.VERTICAL;
        });

        const $viewportBounds = toObservable(this.viewportBounds),
            $contentBounds = toObservable(this.contentBounds),
            $isVertical = toObservable(this.isVertical),
            $overscrollIndicatorShowAutomatically = toObservable(this.overscrollIndicatorShowAutomatically),
            $overscrollIndicatorStartEnabled = toObservable(this.overscrollIndicatorStartEnabled),
            $overscrollIndicatorEndEnabled = toObservable(this.overscrollIndicatorEndEnabled),
            $overscrollIndicatorUseOffsets = toObservable(this.overscrollIndicatorUseOffsets),
            $startOffset = toObservable(this.startOffset),
            $endOffset = toObservable(this.endOffset);

        combineLatest([$viewportBounds, $contentBounds, $isVertical, $overscrollIndicatorShowAutomatically, $overscrollIndicatorStartEnabled,
            $overscrollIndicatorEndEnabled]).pipe(
                takeUntilDestroyed(),
                debounceTime(0),
                tap(([, , isVertical, showAutomatically, startEnabled, endEnabled]) => {
                    const start = (startEnabled || showAutomatically) ? this.scrollable : false,
                        end = (endEnabled || showAutomatically) ? this.scrollable : false;
                    this._actualOverscrollIndicatorLeftEnabled.set(isVertical ? false : start);
                    this._actualOverscrollIndicatorTopEnabled.set(isVertical ? start : false);
                    this._actualOverscrollIndicatorRightEnabled.set(isVertical ? false : end);
                    this._actualOverscrollIndicatorBottomEnabled.set(isVertical ? end : false);
                }),
            ).subscribe();

        combineLatest([$isVertical, $startOffset, $overscrollIndicatorUseOffsets, $overscrollIndicatorShowAutomatically, $overscrollIndicatorStartEnabled]).pipe(
            takeUntilDestroyed(),
            debounceTime(0),
            tap(([isVertical, startOffset, useOffsets, showAutomatically, startEnabled]) => {
                const start = (startEnabled || showAutomatically) ? this.scrollable : false;
                if (start) {
                    this._leftOffset.set(useOffsets ? (isVertical ? 0 : startOffset) : 0);
                    this._topOffset.set(useOffsets ? (isVertical ? startOffset : 0) : 0);
                }
            }),
        ).subscribe();

        combineLatest([$isVertical, $endOffset, $overscrollIndicatorUseOffsets, $overscrollIndicatorShowAutomatically,
            $overscrollIndicatorEndEnabled]).pipe(
                takeUntilDestroyed(),
                debounceTime(0),
                tap(([isVertical, endOffset, useOffsets, showAutomatically, endEnabled]) => {
                    const end = (endEnabled || showAutomatically) ? this.scrollable : false;
                    if (end) {
                        this._rightOffset.set(useOffsets ? (isVertical ? 0 : endOffset) : 0);
                        this._bottomOffset.set(useOffsets ? (isVertical ? endOffset : 0) : 0);
                    }
                }),
            ).subscribe();
    }
    stopScrolling(force?: boolean): void {
        throw new Error('Method not implemented.');
    }

    tick() {
        this.onResizeContent();
        this.onResizeViewport();
    }

    protected overrideCoordinates(x: number, y: number) { }

    protected normalizeScrollSize() {
        if (this.isInfinity()) {
            const isVertical = this.isVertical();
            if (isVertical) {
                const scrollSize = (this._totalSize - this.viewportBounds().height);
                if (this._y < 0) {
                    this._isCoordinatesOverrided = true;
                    const currentPosition = scrollSize;
                    this.overrideCoordinates(this._x, currentPosition);
                    this._y = currentPosition;
                    return true;
                } else if (this._y > scrollSize) {
                    this._isCoordinatesOverrided = true;
                    const currentPosition = 0;
                    this.overrideCoordinates(this._x, currentPosition);
                    this._y = currentPosition;
                    return true;
                }
            } else {
                const scrollSize = (this._totalSize - this.viewportBounds().width);
                if (this._x < 0) {
                    this._isCoordinatesOverrided = true;
                    const currentPosition = scrollSize;
                    this.overrideCoordinates(currentPosition, this._y);
                    this._x = currentPosition;
                    return true;
                } else if (this._x > scrollSize) {
                    this._isCoordinatesOverrided = true;
                    const currentPosition = 0;
                    this.overrideCoordinates(currentPosition, this._y);
                    this._x = currentPosition;
                    return true;
                }
            }
        }
        this._isCoordinatesOverrided = false;
        return false;
    }

    protected onResizeViewport() {
        const viewport = this.scrollViewport()?.nativeElement;
        if (!!viewport) {
            const isVertical = this.isVertical(),
                startOffset = this.startOffset(),
                endOffset = this.endOffset(),
                w = viewport.offsetWidth,
                h = viewport.offsetHeight,
                width = isVertical ? w : (w - startOffset - endOffset),
                height = isVertical ? (h - startOffset - endOffset) : h,
                bounds = this.viewportBounds();
            if (bounds.width === width && bounds.height === height) {
                return;
            }
            this.viewportBounds.set({ width, height });
        }
    }

    protected onResizeContent(value: number | null = null) {
        const content = this.scrollContent()?.nativeElement;
        if (!!content) {
            const isVertical = this.isVertical(),
                startOffset = this.startOffset(),
                w = content.offsetWidth,
                h = content.offsetHeight,
                width = isVertical ? w : value ?? (w - startOffset),
                height = isVertical ? value ?? (h - startOffset) : h,
                bounds = this.contentBounds();
            if (bounds.width === width && bounds.height === height) {
                return;
            }
            this.contentBounds.set({ width, height });
        }
    }

    abstract scroll(params: IScrollToParams): Array<number> | number | null;
}