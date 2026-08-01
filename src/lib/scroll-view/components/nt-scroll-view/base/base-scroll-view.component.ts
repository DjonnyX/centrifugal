import {
    Component, DestroyRef, ElementRef, inject, input, output, signal, TemplateRef, viewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ScrollerDirection, ScrollerDirections } from '../enums';
import {
    CONTROL_CONTAINER_SERVICE, IOverscrollEvent, ISize, SCROLL_VIEW_INVERSION, SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE,
    SCROLL_VIEW_TYPE,
    TextDirection, TextDirections,
} from '../../../../common';
import { INtScroller } from '../../../../common/interfaces/nt-scroller';
import { INtScrollViewService } from '../../../interfaces';
import { INtControlContainerService } from '../../../../control-container/interfaces';
import { IScrollToParams } from '../../../../common/interfaces/scroll-to-params';
import { IBaseScrollViewService } from '../../../../common/interfaces/base-scroll-view-service';
import { IBaseScrollView } from '../../../../common/interfaces/base-scroll-view';

/**
 * BaseScrollView
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-scroll-view/base/base-scroll-view.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'base-scroll-view',
    template: '',
})
export abstract class BaseScrollView implements INtScroller<IBaseScrollViewService> {
    readonly scrollContent = viewChild<ElementRef<HTMLDivElement>>('scrollContent');

    readonly scrollViewport = viewChild<ElementRef<HTMLDivElement>>('scrollViewport');

    readonly onOverscroll = output<IOverscrollEvent>();
    
    readonly onLeftOverscrollIndiatorPinned = output<boolean>();
    
    readonly onTopOverscrollIndiatorPinned = output<boolean>();
    
    readonly onRightOverscrollIndiatorPinned = output<boolean>();
    
    readonly onBottomOverscrollIndiatorPinned = output<boolean>();

    readonly overscrollIndicatorLeftEnabled = input<boolean>(false);
    
    readonly overscrollIndicatorTopEnabled = input<boolean>(false);
    
    readonly overscrollIndicatorRightEnabled = input<boolean>(false);
    
    readonly overscrollIndicatorBottomEnabled = input<boolean>(false);

    readonly overscrollIndicatorLeftRenderer = input<TemplateRef<any> | null>(null);

    readonly overscrollIndicatorTopRenderer = input<TemplateRef<any> | null>(null);

    readonly overscrollIndicatorRightRenderer = input<TemplateRef<any> | null>(null);

    readonly overscrollIndicatorBottomRenderer = input<TemplateRef<any> | null>(null);
    
    readonly direction = input<ScrollerDirections>(ScrollerDirection.BOTH);

    readonly langTextDir = input<TextDirection>(TextDirections.LTR);

    readonly leftOffset = input<number>(0);

    readonly topOffset = input<number>(0);

    readonly rightOffset = input<number>(0);

    readonly bottomOffset = input<number>(0);

    readonly grabbing = signal<boolean>(false);

    readonly context = input<IBaseScrollView<IBaseScrollViewService, IBaseScrollViewService> | null>(null);
    get parent() { return this.context(); }

    protected _type = inject(SCROLL_VIEW_TYPE, { optional: true });
    get type() { return this._type; }

    protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    protected _inversion = inject(SCROLL_VIEW_INVERSION);

    protected _overscrollEnabled = inject(SCROLL_VIEW_OVERSCROLL_ENABLED);

    protected _$overscroll = new Subject<IOverscrollEvent>();
    readonly $overscroll = this._$overscroll.asObservable();

    protected _$updateScrollBarHorizontal = new Subject<void>();
    protected $updateScrollBarHorizontal = this._$updateScrollBarHorizontal.asObservable();

    protected _$updateScrollBarVertical = new Subject<void>();
    protected $updateScrollBarVertical = this._$updateScrollBarVertical.asObservable();

    get scrollableX() {
        const { width } = this.viewportBounds(),
            viewportSize = width,
            totalSize = this._totalWidth;
        return this._inversion ? (totalSize < viewportSize) : (totalSize > viewportSize);
    }

    get scrollableY() {
        const { height } = this.viewportBounds(),
            viewportSize = height,
            totalSize = this._totalHeight;
        return this._inversion ? (totalSize < viewportSize) : (totalSize > viewportSize);
    }

    protected _destroyRef = inject(DestroyRef);

    protected _service = inject<INtScrollViewService>(SCROLL_VIEW_SERVICE);

    get service() { return this._service; }

    protected _controlContainerService = inject<INtControlContainerService>(CONTROL_CONTAINER_SERVICE);

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

    protected _actualTotalWidth: number = 0;
    protected _totalWidth: number = 0;
    set totalWidth(v: number) {
        if (this._totalWidth !== v) {
            this._totalWidth = v;
            const startOffset = this.leftOffset();
            this._actualTotalWidth = v + startOffset;

            this.normalizeScrollWidth();
        }
    }
    get totalWidth() {
        return this._totalWidth;
    }

    protected _actualTotalHeight: number = 0;
    protected _totalHeight: number = 0;
    set totalHeight(v: number) {
        if (this._totalHeight !== v) {
            this._totalHeight = v;
            const startOffset = this.topOffset();
            this._actualTotalHeight = v + startOffset;

            this.normalizeScrollHeight();
        }
    }
    get totalHeight() {
        return this._totalHeight;
    }

    protected _startLayoutOffsetX: number = 0;
    set startLayoutOffsetX(v: number) {
        if (this._startLayoutOffsetX !== v) {
            this._startLayoutOffsetX = v;
        }
    }
    get startLayoutOffsetX() { return this._startLayoutOffsetX; }

    protected _startLayoutOffsetY: number = 0;
    set startLayoutOffsetY(v: number) {
        if (this._startLayoutOffsetY !== v) {
            this._startLayoutOffsetY = v;
        }
    }
    get startLayoutOffsetY() { return this._startLayoutOffsetY; }

    get actualScrollHeight() {
        const { height: viewportHeight } = this.viewportBounds(),
            totalSize = this._actualTotalHeight,
            startOffset = this.topOffset(),
            endOffset = this.bottomOffset();
        if (this._inversion) {
            return totalSize > viewportHeight ? endOffset : viewportHeight - totalSize;
        }
        return totalSize < viewportHeight ? startOffset : totalSize - viewportHeight;
    }

    get actualScrollWidth() {
        const { width: viewportWidth } = this.viewportBounds(),
            totalSize = this._actualTotalWidth,
            startOffset = this.leftOffset(),
            endOffset = this.rightOffset();
        if (this._inversion) {
            return totalSize > viewportWidth ? endOffset : viewportWidth - totalSize;
        }
        return totalSize < viewportWidth ? startOffset : totalSize - viewportWidth;
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
            startOffset = this.leftOffset(),
            endOffset = this.rightOffset();
        if (this._inversion) {
            return contentWidth > viewportWidth ? endOffset : (viewportWidth - contentWidth);
        }
        return contentWidth < viewportWidth ? startOffset : (contentWidth - viewportWidth);
    }

    get scrollHeight() {
        const { height: viewportHeight } = this.viewportBounds(),
            { height: contentHeight } = this.contentBounds(),
            startOffset = this.topOffset(),
            endOffset = this.bottomOffset();
        if (this._inversion) {
            return contentHeight > viewportHeight ? endOffset : (viewportHeight - contentHeight);
        }
        return contentHeight < viewportHeight ? startOffset : (contentHeight - viewportHeight);
    }

    readonly viewportBounds = signal<ISize>({ width: 0, height: 0 });

    readonly contentBounds = signal<ISize>({ width: 0, height: 0 });

    tick() {
        this.onResizeContent();
        this.onResizeViewport();
    }

    protected overrideCoordinates(x: number, y: number) { }

    protected normalizeScrollWidth() {
        return false;
    }

    protected normalizeScrollHeight() {
        return false;
    }

    protected normalizeScrollSize() {
        this.normalizeScrollWidth();
        this.normalizeScrollHeight();
    }

    protected onResizeViewport() {
        const viewport = this.scrollViewport()?.nativeElement;
        if (!!viewport) {
            const leftOffset = this.leftOffset(),
                rightOffset = this.rightOffset(),
                topOffset = this.topOffset(),
                bottomOffset = this.bottomOffset(),
                w = viewport.offsetWidth,
                h = viewport.offsetHeight,
                width = w - leftOffset - rightOffset,
                height = h - topOffset - bottomOffset,
                bounds = this.viewportBounds();
            if (bounds.width === width && bounds.height === height) {
                return;
            }
            this.viewportBounds.set({ width, height });
        }
    }

    protected onResizeContent(valueWidth: number | null = null, valueHeight: number | null = null) {
        const content = this.scrollContent()?.nativeElement;
        if (!!content) {
            const leftOffset = this.leftOffset(),
                topOffset = this.topOffset(),
                w = content.offsetWidth,
                h = content.offsetHeight,
                width = valueWidth ?? (w - leftOffset),
                height = valueHeight ?? (h - topOffset),
                bounds = this.contentBounds();
            if (bounds.width === width && bounds.height === height) {
                return;
            }
            this.contentBounds.set({ width, height });
        }
    }

    abstract stopScrolling(force?: boolean): void;

    abstract scroll(params: IScrollToParams): Array<number> | null;
}