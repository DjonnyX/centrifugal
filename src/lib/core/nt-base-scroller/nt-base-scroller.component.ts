import {
    Component, DestroyRef, ElementRef, inject, input, output, signal, viewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
    CONTROL_CONTAINER_SERVICE, Direction, Directions, IOverscrollEvent, ISize, OVERSCROLL_SERVICE, SCROLL_VIEW_INVERSION,
    SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE, SCROLL_VIEW_TYPE, TextDirection, TextDirections,
} from '../../common';
import { INtScroller } from '../../common/interfaces/nt-scroller';
import { INtControlContainerService } from '../../control-container/interfaces';
import { INtBaseScrollViewService } from '../../common/interfaces/nt-base-scroll-view-service';
import { INtBaseScrollView } from '../../common/interfaces/nt-base-scroll-view';
import { INtOverscrollService } from '../../common/interfaces/nt-overscroll-service';

/**
 * NtBaseScroller
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/core/nt-base-scroller/nt-d-scroll-view/base/nt-base-scroller.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-base-scroller',
    template: '',
})
export abstract class NtBaseScroller<S extends INtBaseScrollViewService> implements Partial<INtScroller<S>> {
    readonly scrollContent = viewChild<ElementRef<HTMLDivElement>>('scrollContent');

    readonly scrollViewport = viewChild<ElementRef<HTMLDivElement>>('scrollViewport');

    protected _overscrollService = inject(OVERSCROLL_SERVICE, { optional: true });

    readonly onVirtualClick = output<PointerEvent | TouchEvent>();

    readonly onOverscroll = output<IOverscrollEvent>();

    readonly overscrollAreaShowAutomatically = input<boolean>(false);

    readonly overscrollAreaUseOffsets = input<boolean>(false);

    readonly overscrollService = input<INtOverscrollService | null>(null);

    readonly interactive = input<boolean>(true);

    readonly direction = input<Direction>(Directions.BOTH);

    readonly langTextDir = input<TextDirection>(TextDirections.LTR);

    readonly isInfinity = input<boolean>(false);

    protected _actualOverscrollAreaLeftEnabled = signal<boolean>(false);

    protected _actualOverscrollAreaTopEnabled = signal<boolean>(false);

    protected _actualOverscrollAreaRightEnabled = signal<boolean>(false);

    protected _actualOverscrollAreaBottomEnabled = signal<boolean>(false);

    protected _userActionDuringAnimation = signal<boolean>(false);

    get userActionDuringAnimation() { return this._userActionDuringAnimation(); }

    protected _grabbing = signal<boolean>(false);

    get grabbing() { return this._grabbing(); }

    readonly context = input<INtBaseScrollView<INtBaseScrollViewService, INtBaseScrollViewService> | null>(null);
    get parent() { return this.context() as (INtBaseScrollView<S, S> | null); }

    get contentElement(): HTMLDivElement | null {
        return this.scrollContent()?.nativeElement ?? null;
    }

    protected _type = inject(SCROLL_VIEW_TYPE, { optional: true });
    get type() { return this._type; }

    protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    protected _inversion = inject(SCROLL_VIEW_INVERSION);

    readonly deferredResize = input(false);

    readonly invertOverscroll = input(false);

    protected _overscrollEnabled = inject(SCROLL_VIEW_OVERSCROLL_ENABLED);

    protected _$preresizeViewport = new Subject<ISize>();
    readonly $preresizeViewport = this._$preresizeViewport.asObservable();

    protected _$resizeViewport = new Subject<ISize>();
    readonly $resizeViewport = this._$resizeViewport.asObservable();

    protected _$resizeContent = new Subject<ISize>();
    readonly $resizeContent = this._$resizeContent.asObservable();

    protected _$overscroll = new Subject<IOverscrollEvent>();
    $overscroll = this._$overscroll.asObservable();

    protected _$overscrollEffectEvent = new Subject<IOverscrollEvent>();
    $overscrollEffectEvent = this._$overscroll.asObservable();

    protected _$updateScrollBarHorizontal = new Subject<void>();
    protected $updateScrollBarHorizontal = this._$updateScrollBarHorizontal.asObservable();

    protected _$updateScrollBarVertical = new Subject<void>();
    protected $updateScrollBarVertical = this._$updateScrollBarVertical.asObservable();

    protected _moveIteration = 0;

    protected _clientPositionOffsetX = 0;

    protected _clientPositionOffsetY = 0;

    protected _destroyRef = inject(DestroyRef);

    protected _service = inject<S>(SCROLL_VIEW_SERVICE);

    get service() { return this._service; }

    protected _controlContainerService = inject<INtControlContainerService>(CONTROL_CONTAINER_SERVICE);

    protected _isMoving = false;
    get isMoving() {
        return this._isMoving;
    }

    protected _isContainerAllowedForCorrection: boolean = true;

    protected _horizontalScrollRatioWhenGrabbing = 0;
    get horizontalScrollRatioWhenGrabbing() { return this._horizontalScrollRatioWhenGrabbing; }
    set horizontalScrollRatioWhenGrabbing(v: number) {
        this._horizontalScrollRatioWhenGrabbing = v;
        if (!this._isContainerAllowedForCorrection) {
            const parentScroller = this._service.parent?.scrollView;
            if (!!parentScroller) {
                parentScroller.horizontalScrollRatioWhenGrabbing = v;
            }
        }
    }

    protected _verticalScrollRatioWhenGrabbing = 0;
    get verticalScrollRatioWhenGrabbing() { return this._verticalScrollRatioWhenGrabbing; }
    set verticalScrollRatioWhenGrabbing(v: number) {
        this._verticalScrollRatioWhenGrabbing = v;
        if (!this._isContainerAllowedForCorrection) {
            const parentScroller = this._service.parent?.scrollView;
            if (!!parentScroller) {
                parentScroller.verticalScrollRatioWhenGrabbing = v;
            }
        }
    }

    readonly viewportBounds = signal<ISize>({ width: 0, height: 0 });

    readonly contentBounds = signal<ISize>({ width: 0, height: 0 });

    protected _isCoordinatesOverrided: boolean = false;

    protected _disableAlignment: boolean = false;

    protected _mouseCanceled: boolean = false;

    protected _touchCanceled: boolean = false;

    constructor() { }

    abstract stopScrolling(force?: boolean): void;

    getOverscrollService(): INtOverscrollService | null { return this._overscrollService; }

    setClientPositionOffset(x: number, y: number): void {
        if (this._moveIteration === 0) {
            this._clientPositionOffsetX = x;
            this._clientPositionOffsetY = y;
        }
    }

    setOverscrollEffectEvent(e: IOverscrollEvent): void {
        const overscrollService = this.overscrollService();
        if (!!overscrollService) {
            overscrollService.emit(e, true);
        } else {
            this._$overscrollEffectEvent.next(e);
        }
    }

    setOverscrollEvent(e: IOverscrollEvent): void {
        const overscrollService = this.overscrollService();
        if (!!overscrollService) {
            overscrollService.emit(e, true);
        } else {
            this._$overscroll.next(e);
        }
    }
}