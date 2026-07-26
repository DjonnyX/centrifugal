import { Component, inject, input, TemplateRef, ViewEncapsulation } from "@angular/core";
import { INtScrollViewService, NtVirtualScrollViewComponent, NtVirtualScrollViewService } from "../scroll-view";
import {
  CONTROL_CONTAINER_SERVICE, ElementNames, INtBaseControlContainerService, SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE,
  SCROLL_VIEW_USER_INTERACTION_ENABLED,
} from "../common";
import { NtDrawerContainerService } from "./nt-drawer-container.service";
import { fromEvent, tap } from "rxjs";
import { CLICK } from "../common/const/event-names";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TABINDEX } from "../common/const/attribute-names";
import { ZERO } from "../common/const/base-prop-names";
import { validateString } from "../common/utils";
import { DEFAULT_EXCLUDE_ELEMETN_LIST } from "./const";

/**
 * NtDrawerContainerComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-drawer-container.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
  selector: 'nt-drawer-container',
  templateUrl: './nt-drawer-container.component.html',
  styleUrl: './nt-drawer-container.component.scss',
  host: {
    'style': 'position: relative;'
  },
  standalone: false,
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [
    { provide: SCROLL_VIEW_USER_INTERACTION_ENABLED, useValue: true },
    { provide: SCROLL_VIEW_OVERSCROLL_ENABLED, useValue: true },
    { provide: SCROLL_VIEW_SERVICE, useClass: NtVirtualScrollViewService },
    { provide: CONTROL_CONTAINER_SERVICE, useClass: NtDrawerContainerService },
  ],
})
export class NtDrawerContainerComponent<S extends INtScrollViewService,
  C extends INtBaseControlContainerService> extends NtVirtualScrollViewComponent<S> {
  protected _controlService = inject<C>(CONTROL_CONTAINER_SERVICE);

  protected override _scrollbarThickness = {
    transform: (v: number) => {
      console.error('The "scrollbarThickness" property is not available.');
      return 0;
    },
  } as any;

  /**
   * @deprecated
   * The `scrollbarThickness` property is not available for the control container.
   */
  override scrollbarThickness = input<number>(0, { ...this._scrollbarThickness });

  protected override _scrollbarMinSize = {
    transform: (v: number) => {
      console.error('The "scrollbarMinSize" property is not available.');
      return 0;
    },
  } as any;

  /**
   * @deprecated
   * The `scrollbarMinSize` property is not available for the control container.
   */
  override scrollbarMinSize = input<number>(0, { ...this._scrollbarMinSize });

  protected override _scrollbarThumbRenderer = {
    transform: (v: any) => {
      console.error('The "scrollbarThumbRenderer" property is not available.');
      return null;
    },
  } as any;

  /**
   * @deprecated
   * The `scrollbarThumbRenderer` property is not available for the control container.
   */
  override scrollbarThumbRenderer = input<TemplateRef<any> | null>(null, { ...this._scrollbarThumbRenderer });

  protected override _scrollbarThumbParams = {
    transform: (v: { [propName: string]: any } | null) => {
      console.error('The "scrollbarThumbParams" property is not available.');
      return null;
    },
  } as any;

  /**
   * @deprecated
   * The `scrollbarThumbParams` property is not available for the control container.
   */
  override scrollbarThumbParams = input<{ [propName: string]: any } | null>({}, { ...this._scrollbarThumbParams });

  protected override _scrollbarEnabledOptions = {
    transform: (v: boolean) => {
      console.error('The "scrollbarEnabled" property is not available.');
      return false;
    },
  } as any;

  /**
   * @deprecated
   * The `scrollbarEnabled` property is not available for the control container.
   */
  override scrollbarEnabled = input<boolean>(false, { ...this._scrollbarEnabledOptions });

  protected override _scrollbarInteractiveOptions = {
    transform: (v: boolean) => {
      console.error('The "scrollbarInteractive" property is not available.');
      return false;
    },
  } as any;

  /**
   * @deprecated
   * The `scrollbarInteractive` property is not available for the control container.
   */
  override scrollbarInteractive = input<boolean>(false, { ...this._scrollbarInteractiveOptions });

  protected override _overlappingScrollbarOptions = {
    transform: (v: boolean) => {
      console.error('The "overlappingScrollbar" property is not available.');
      return false;
    },
  } as any;

  /**
   * @deprecated
   * The `overlappingScrollbar` property is not available for the control container.
   */
  override overlappingScrollbar = input<boolean>(false, { ...this._overlappingScrollbarOptions });

  protected _excludeElementList = {
    transform: (v: ElementNames) => {
      let valid = !!v;
      if (!!v) {
        for (const name of v) {
          valid = validateString(name);
          if (!valid) {
            break;
          }
        }
      }

      if (!valid) {
        console.error('The "excludeElementList" parameter must be of type `Array<string>`.');
        return DEFAULT_EXCLUDE_ELEMETN_LIST;
      }
      return v;
    },
  } as any;

  /**
   * Allowed native interactive elements for user interaction.
   */
  allowedNativeInteractiveElements = input<ElementNames>(DEFAULT_EXCLUDE_ELEMETN_LIST, { ...this._excludeElementList });

  constructor() {
    super();

    this._controlService.initialize(this._id, this.host);

    this.host.setAttribute(TABINDEX, ZERO);

    const $click = fromEvent(this.host, CLICK);
    $click.pipe(
      takeUntilDestroyed(),
      tap(e => {
        const target = e.currentTarget as HTMLElement,
          allowedNativeInteractiveElements: Array<string> = this.allowedNativeInteractiveElements(),
          targetTagName = target?.tagName;
        if (!!targetTagName && allowedNativeInteractiveElements.indexOf(targetTagName) > -1) {
          return;
        }
        this.host.focus({ preventScroll: true });
      }),
    ).subscribe();
  }
}