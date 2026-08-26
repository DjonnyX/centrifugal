import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject, tap } from 'rxjs';
import { TrackBox } from './core/track-box';
import { TrackBoxEvents } from './core/events';
import { IRenderVirtualListItem, IVirtualListCollection, IVirtualListItem, IVirtualListItemConfigMap } from './models';
import { INtListAnimationParams, IScrollOptions } from './interfaces';
import { IRenderVirtualListCollection } from './models/render-collection.model';
import { FocusAlignments } from './enums';
import { SelectingModesTypes } from './enums/selecting-modes-types';
import {
  DEFAULT_ANIMATION_PARAMS, DEFAULT_COLLAPSE_BY_CLICK, DEFAULT_ITEM_SIZE, DEFAULT_SELECT_BY_CLICK, DEFAULT_SNAP_TO_ITEM,
  DEFAULT_ZINDEX_WHEN_SELECTING, ITEM_CONTAINER, TRACK_BY_PROPERTY_NAME,
} from './const';
import { FocusAlignment } from './types';
import { getListElements, NTVL_INDEX } from './components/nt-list-item/utils';
import { FocusItemParams } from './types/focus-item-params';
import { validateFocusAlignment, validateId } from './utils/list-validators';
import { getSelectorByItemId } from './utils/get-selector-by-item-id';
import { IScrollToParams } from './interfaces/scroll-to-params';
import { Id, IPoint, IRect, ISize } from '../common';
import { NtBaseScrollViewService } from '../common/services/nt-base-scroll-view.service';
import { INtBaseScrollViewService } from '../common/interfaces/nt-base-scroll-view-service';
import { INtScroller } from '../common/interfaces/nt-scroller';
import { BEHAVIOR_AUTO, BEHAVIOR_INSTANT } from '../common/const/behavior';

/**
 * NtListService
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/list/nt-list.service.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Injectable({
  providedIn: 'root'
})
export class NtListService extends NtBaseScrollViewService implements INtBaseScrollViewService, OnDestroy {
  private _$virtualClick = new Subject<IRenderVirtualListItem<any> | null>();
  $virtualClick = this._$virtualClick.asObservable();

  private _$selectedIds = new BehaviorSubject<Array<Id> | Id | null>(null);
  $selectedIds = this._$selectedIds.asObservable();

  private _$collapsedIds = new BehaviorSubject<Array<Id>>([]);
  $collapsedIds = this._$collapsedIds.asObservable();

  private _$selectingMode = new BehaviorSubject<SelectingModesTypes>(0);
  $selectingMode = this._$selectingMode.asObservable();

  set selectingMode(v: SelectingModesTypes) {
    this._$selectingMode.next(v);
  }

  private _$focusedId = new BehaviorSubject<Id | null>(null);
  $focusedId = this._$focusedId.asObservable();
  set focusedId(v: Id | null) {
    if (this._$focusedId.getValue() !== v) {
      this._$focusedId.next(v);
    }
  }
  get focusedId() { return this._$focusedId.getValue(); }

  private _$focusItem = new Subject<FocusItemParams>();
  readonly $focusItem = this._$focusItem.asObservable();

  private _$scrollTo = new Subject<IScrollToParams | undefined>();
  readonly $scrollTo = this._$scrollTo.asObservable();

  private _$scrollToStart = new Subject<IScrollOptions | undefined>();
  readonly $scrollToStart = this._$scrollToStart.asObservable();

  private _$scrollToEnd = new Subject<IScrollOptions | undefined>();
  readonly $scrollToEnd = this._$scrollToEnd.asObservable();

  private _$cacheVersion = new BehaviorSubject<number>(-1);
  readonly $cacheVersion = this._$cacheVersion.asObservable();

  trackBy: string = TRACK_BY_PROPERTY_NAME;

  lastFocusedItemId: number = -1;

  scrollStartOffset: number = 0;

  scrollEndOffset: number = 0;

  zIndexWhenSelecting: string | null = DEFAULT_ZINDEX_WHEN_SELECTING;

  selectByClick: boolean = DEFAULT_SELECT_BY_CLICK;

  collapseByClick: boolean = DEFAULT_COLLAPSE_BY_CLICK;

  defaultItemValue: IVirtualListItem | null = null;

  snapToItem: boolean = DEFAULT_SNAP_TO_ITEM;

  isInfinity: boolean = false;

  isVertical: boolean = true;

  dynamic: boolean = true;

  itemSize: number = DEFAULT_ITEM_SIZE;

  snapScrollToStart: boolean = false;

  snapScrollToEnd: boolean = false;

  animationParams: INtListAnimationParams = DEFAULT_ANIMATION_PARAMS;

  isNoneCollapse: boolean = false;

  isMultipleCollapse: boolean = false;

  isAccordionCollapse: boolean = false;

  private _trackBox: TrackBox | undefined;

  listElement: HTMLDivElement | null = null;

  items: IVirtualListCollection = [];

  itemConfigMap: IVirtualListItemConfigMap = {};

  private _$displayItems = new BehaviorSubject<IRenderVirtualListCollection>([]);
  readonly $displayItems = this._$displayItems.asObservable();
  get displayItems() { return this._$displayItems.getValue(); }

  private _collection: IRenderVirtualListCollection = [];
  set collection(v: IRenderVirtualListCollection) {
    if (this._collection === v) {
      return;
    }

    this._collection = v;

    this._$displayItems.next(v);
  }
  get collection() { return this._collection; }

  get scrollBarSize() { return this._$scrollBarSize.getValue(); }

  private _scrollBarSize: number = 0;
  set scrollBarSize(v: number) {
    if (this._scrollBarSize === v) {
      return;
    }

    this._scrollBarSize = v;

    this._$scrollBarSize.next(v);
  }
  private _$scrollBarSize = new BehaviorSubject<number>(this._scrollBarSize);
  readonly $scrollBarSize = this._$scrollBarSize.asObservable();

  private _$tick = new Subject<void>();

  private _onTickHandler = () => {
    this._$tick.next();
  };

  private _onTrackBoxChangeHandler = (v: number) => {
    this._$cacheVersion.next(v);
  };

  set selectedIds(ids: Array<Id> | Id | null) {
    if (JSON.stringify(this._$selectedIds.getValue()) !== JSON.stringify(ids)) {
      this._$selectedIds.next(ids);
    }
  }

  get selectedIds() { return this._$selectedIds.getValue(); }

  set collapsedIds(ids: Array<Id>) {
    if (JSON.stringify(this._$collapsedIds.getValue()) !== JSON.stringify(ids)) {
      this._$collapsedIds.next(ids);
    }
  }

  get collapsedIds() { return this._$collapsedIds.getValue(); }

  constructor() {
    super();

    this.$tick = this._$tick.asObservable();

    this._$selectingMode.pipe(
      takeUntilDestroyed(),
      tap(v => {
        switch (v) {
          case SelectingModesTypes.SELECT: {
            const curr = this._$selectedIds.getValue();
            if (typeof curr !== 'number' && typeof curr !== 'string') {
              this._$selectedIds.next(null);
            }
            break;
          }
          case SelectingModesTypes.MULTI_SELECT: {
            if (!(this._$selectedIds.getValue() instanceof Array)) {
              this._$selectedIds.next([]);
            }
            break;
          }
          case SelectingModesTypes.NONE:
          default: {
            this._$selectedIds.next(null);
            break;
          }
        }
      }),
    ).subscribe();
  }

  virtualClick(data: IRenderVirtualListItem | null) {
    this._$virtualClick.next(data);
    if (this.collapseByClick) {
      const trackBy = this.trackBy, id = (data as any)?.[trackBy] ?? null;
      this.collapse(id);
    }
    if (this.selectByClick) {
      const trackBy = this.trackBy, id = (data as any)?.[trackBy] ?? null;
      this.select(id);
    }
  }

  override update(immediately: boolean = false) {
    this._trackBox?.changes(immediately, false);
  }

  private getItemConfig(id: Id) {
    const displayItems = this.displayItems;
    if (!!displayItems) {
      const trackBy = this.trackBy;
      return displayItems.find(data => {
        const _id = (data as any)?.[trackBy] ?? null;
        return _id === id;
      })?.config ?? null;
    }
    return null;
  }

  /**
   * Selects a list item
   * @param id 
   * @param selected - If the value is undefined, then the toggle method is executed, if false or true, then the selection/deselection is performed.
   */
  select(id: Id, selected?: boolean) {
    validateId(id);
    const config = this.getItemConfig(id);
    if ((!!config && config.selectable)) {
      switch (this._$selectingMode.getValue()) {
        case SelectingModesTypes.SELECT: {
          const curr = this._$selectedIds.getValue() as (Id | undefined);
          if (selected === undefined) {
            this._$selectedIds.next(curr !== id ? id : null);
          } else {
            this._$selectedIds.next(selected ? id : null);
          }
          break;
        }
        case SelectingModesTypes.MULTI_SELECT: {
          const curr = [...(this._$selectedIds.getValue() || []) as Array<Id>],
            index = curr.indexOf(id);
          if (selected === undefined) {
            if (index > -1) {
              curr.splice(index, 1);
              this._$selectedIds.next(curr);
            } else {
              this._$selectedIds.next([...curr, id]);
            }
          } else if (selected) {
            if (index > -1) {
              this._$selectedIds.next(curr);
            } else {
              this._$selectedIds.next([...curr, id]);
            }
          } else {
            if (index > -1) {
              curr.splice(index, 1);
              this._$selectedIds.next(curr);
            } else {
              this._$selectedIds.next(curr);
            }
          }
          break;
        }
        case SelectingModesTypes.NONE:
        default: {
          this._$selectedIds.next(null);
        }
      }
    }
  }

  /**
    * Collapse list items
    * @param data 
    * @param collapsed - If the value is undefined, then the toggle method is executed, if false or true, then the collapse/expand is performed.
    */
  collapse(id: Id, collapsed?: boolean) {
    if (this.isNoneCollapse) {
      return;
    }

    validateId(id);
    const config = this.getItemConfig(id);
    if ((!!config && config.collapsable)) {
      const allGroups: Array<Id> = [];
      if (this.isAccordionCollapse) {
        const items = this.items, itemConfigMap = this.itemConfigMap, trackBy = this.trackBy;
        for (let i = 0, l = items.length; i < l; i++) {
          const item = items[i], id = item[trackBy], collapsable = itemConfigMap?.[id]?.collapsable === true;
          if (!collapsable) {
            continue;
          }
          allGroups.push(id);
        }
      }

      const curr = this.isAccordionCollapse ? allGroups : [...(this._$collapsedIds.getValue() || []) as Array<Id>],
        index = curr.indexOf(id);
      if (!collapsed) {
        if (index > -1) {
          curr.splice(index, 1);
          this._$collapsedIds.next(curr);
        } else {
          this._$collapsedIds.next([...curr, id]);
        }
      } else if (collapsed) {
        if (index > -1) {
          this._$collapsedIds.next(curr);
        } else {
          this._$collapsedIds.next([...curr, id]);
        }
      } else {
        if (index > -1) {
          curr.splice(index, 1);
          this._$collapsedIds.next(curr);
        } else {
          this._$collapsedIds.next(curr);
        }
      }

      if (this.isAccordionCollapse) {
        this._$scrollTo.next({
          id, cb: null, options: {
            delay: 100, focused: true,
          },
        });
      } else {
        this._$scrollTo.next({
          id, cb: null, options: {
            delay: 100, focused: true,
          },
        });
      }
    }
  }

  getFocusedElementById(id: Id) {
    const el = this.listElement?.querySelector<HTMLDivElement>(getSelectorByItemId(id));
    if (!!el) {
      const focusedEl = el.querySelector<HTMLDivElement>(`.${ITEM_CONTAINER}`);
      if (!!focusedEl) {
        return focusedEl;
      }
    }
    return null;
  }

  /**
   * Returns the bounds of an element with a given id
   */
  getItemBounds(id: Id): ISize | null {
    validateId(id);
    return this._trackBox?.getItemBounds(id) ?? null;
  }

  /**
   * Returns the position of a display item with a given id
   */
  getDisplayItemPosition(id: Id): IPoint | null {
    validateId(id);
    const displayItems = this.displayItems, item = displayItems.find(item => item.id === id) ?? null;
    if (!!item) {
      return {
        x: item.measures.transformedX,
        y: item.measures.transformedY,
      };
    }
    return null;
  }

  /**
   * Focus an list item by a given id.
   */
  focusById(id: Id, align: FocusAlignment = FocusAlignments.NONE, scrollBehavior: ScrollBehavior = "auto") {
    validateId(id);
    validateFocusAlignment(align);
    const el = this.getFocusedElementById(id);
    if (!!el) {
      this.focus(el, align, scrollBehavior);
    }
  }

  focus(element: HTMLElement, align: FocusAlignment = FocusAlignments.CENTER, behavior: ScrollBehavior = BEHAVIOR_AUTO): boolean {
    element.focus({ preventScroll: true });
    if (!!element.parentElement) {
      const position = parseFloat(element.parentElement?.getAttribute('position') ?? '0');
      this._$focusItem.next({ element, position, align, behavior });
      return true;
    }
    return false;
  }

  focusList() {
    const element = this.listElement;
    if (!!element) {
      element.focus({ preventScroll: true });
    }
  }

  focusFirstElement() {
    const elements = this.listElement?.querySelectorAll<HTMLDivElement>(getListElements()),
      elList = (elements ? Array.from(elements) : []).sort((a, b) => {
        const indexA = Number(a.getAttribute(NTVL_INDEX)), indexB = Number(b.getAttribute(NTVL_INDEX));
        if (indexA > indexB) return 1;
        if (indexA < indexB) return -1;
        return 0;
      });
    let element: HTMLElement | undefined = undefined;
    for (let i = 0, l = elList.length; i < l; i++) {
      const el = elList[i], index = Number(el.getAttribute(NTVL_INDEX));
      if (!!el && index > 0) {
        element = el;
        break;
      }
    }
    if (!!element) {
      this.focus(element, FocusAlignments.CENTER, BEHAVIOR_INSTANT);
    }
  }

  initialize(id: number, scrollView: INtScroller<INtBaseScrollViewService>, parentService: INtBaseScrollViewService | null, trackBox: TrackBox) {
    this._id = id;
    this._scrollView = scrollView;
    if (!!parentService) {
      this._parent = parentService;
      this._parentId = parentService.id;
    }
    this._trackBox = trackBox;
    this._trackBox.addEventListener(TrackBoxEvents.TICK, this._onTickHandler);
    this._trackBox.addEventListener(TrackBoxEvents.CHANGE, this._onTrackBoxChangeHandler);
  }

  override getComponentBoundsByIntersectionPosition(position: number, maxPosition: number | null = null): (IRect & { id: Id | null; isFirst: boolean; isLast: boolean; }) | null {
    return this._trackBox?.getComponentBoundsByIntersectionPosition(position, maxPosition) ?? null;
  }

  override setIntersectionElementBySnapToItemAlign(id: Id | null) {
    if (this._$intersectionElementBySnapToItemAlign.getValue() !== id) {
      this._$intersectionElementBySnapToItemAlign.next(id);
    }
  }

  /**
    * The method scrolls the list to the element with the given `id` and returns the value of the scrolled area.
    */
  scrollTo(id: Id, cb: (() => void) | null = null, options: IScrollOptions | null = null) {
    this._$scrollTo.next({ id, cb, options });
  }

  /**
   * Scrolls the scroll area to the first item in the collection.
   */
  scrollToStart(options?: IScrollOptions) {
    this._$scrollToStart.next(options);
  }

  /**
   * Scrolls the list to the end of the content size.
   */
  scrollToEnd(options?: IScrollOptions) {
    this._$scrollToEnd.next(options);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
