import { Component, computed, ElementRef, inject, input, Signal, signal, TemplateRef, viewChild, ViewEncapsulation } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { combineLatest, debounceTime, filter, fromEvent, map, of, skip, skipUntil, startWith, Subject, switchMap, tap, timer } from "rxjs";
import { INtScrollViewService, NtScrollViewComponent, NtScrollViewService } from "../scroll-view";
import {
  CONTROL_CONTAINER_SERVICE, ElementNames, IKeyboardSettings, INtBaseControlContainerService, KeyboardPosition, KeyboardPositions, SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE,
  SCROLL_VIEW_USER_INTERACTION_ENABLED,
} from "../common";
import { MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, TOUCH_END, TOUCH_MOVE, TOUCH_START, WHEEL } from "../common/const/event-names";
import { NtControlContainerService } from "./nt-control-container.service";
import { INtBaseScrollViewService } from "../common/interfaces/nt-base-scroll-view-service";
import { isInteractive } from "../common/utils/is-interactive";
import { ScrollerTypes } from "../common/enums/scroller-types";
import { IFocusedObject } from "../common/interfaces/focused-object";
import { validateArray, validateBoolean, validateInt, validateObject, validateString } from "../common/utils";
import { DEFAULT_EXCLUDE_ELEMETN_LIST } from "../drawer-container/const";
import { DEFAULT_KEYBOARD_ENABLED, DEFAULT_KEYBOARD_SETTINGS } from "./const";
import { BEHAVIOR_AUTO, BEHAVIOR_INSTANT } from "../common/const/behavior";
import { IScrollToParams } from "../common/interfaces/scroll-to-params";
import { PX } from "../common/const/base-prop-names";
import { INtScroller } from "../common/interfaces/nt-scroller";

/**
 * NtScrollViewComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/nt-control-container.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
  selector: 'nt-control-container',
  templateUrl: './nt-control-container.component.html',
  styleUrl: './nt-control-container.component.scss',
  host: {
    'style': 'position: relative;'
  },
  standalone: false,
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [
    { provide: SCROLL_VIEW_USER_INTERACTION_ENABLED, useValue: false },
    { provide: SCROLL_VIEW_OVERSCROLL_ENABLED, useValue: false },
    { provide: CONTROL_CONTAINER_SERVICE, useClass: NtControlContainerService },
    { provide: SCROLL_VIEW_SERVICE, useClass: NtScrollViewService },
  ],
})
export class NtControlContainerComponent extends NtScrollViewComponent<INtScrollViewService, INtScrollViewService> {
  protected _containerComponent = viewChild<ElementRef<HTMLDivElement>>('container');

  protected _controlService = inject<INtBaseControlContainerService>(CONTROL_CONTAINER_SERVICE);

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

  protected override _clickDistance = {
    transform: (v: number) => {
      console.error('The "clickDistance" property is not available.');
      return 0;
    },
  } as any;

  /**
   * @deprecated
   * The `clickDistance` property is not available for the control container.
   */
  override clickDistance = input<number>(0, { ...this._clickDistance });

  protected override _overscrollEnabledOptions = {
    transform: (v: boolean) => {
      console.error('The "overscrollEnabled" property is not available.');
      return false;
    },
  } as any;

  /**
   * @deprecated
   * The `overscrollEnabled` property is not available for the control container.
   */
  override overscrollEnabled = input<boolean>(false, { ...this._overscrollEnabledOptions });

  protected _keyboardEnabledOptions = {
    transform: (v: boolean) => {
      const valid = validateBoolean(v);
      if (!valid) {
        console.error('The "keyboardEnabled" parameter must be of type `boolean`.');
        return DEFAULT_KEYBOARD_ENABLED;
      }
      return v;
    },
  } as any;

  /**
   * Determines whether to show the virtual keyboard for input fields or not.
   */
  keyboardEnabled = input<boolean>(DEFAULT_KEYBOARD_ENABLED, { ...this._keyboardEnabledOptions });

  protected _keyboardSettingsOptions = {
    transform: (v: IKeyboardSettings) => {
      let valid = validateObject(v, true, true);
      if (!valid) {
        console.error('The "keyboardSettings" parameter must be of type `IKeyboardSettings`.');
        return DEFAULT_KEYBOARD_SETTINGS;
      }

      const common = v.common;
      valid = validateObject(common);
      if (!valid) {
        console.error('The "keyboardSettings.common" parameter must be of type `object`.');
        return DEFAULT_KEYBOARD_SETTINGS;
      }
      valid = validateInt(common.focusedTargetOffset);
      if (!valid) {
        console.error('The "keyboardSettings.common.focusedTargetOffset" parameter must be of type `number`.');
        return DEFAULT_KEYBOARD_SETTINGS;
      }
      valid = validateString(common.position) && (common.position === KeyboardPositions.LEFT || common.position === KeyboardPositions.RIGHT ||
        common.position === KeyboardPositions.TOP || common.position === KeyboardPositions.BOTTOM);
      if (!valid) {
        console.error('The "keyboardSettings.common.position" parameter must be on of `left`, `right`, `top` or `bottom`.');
        return DEFAULT_KEYBOARD_SETTINGS;
      }
      valid = validateInt(common.scrollerOffsetWhenFocused);
      if (!valid) {
        console.error('The "keyboardSettings.common.scrollerOffsetWhenFocused" parameter must be of type `number`.');
        return DEFAULT_KEYBOARD_SETTINGS;
      }
      valid = validateInt(common.size);
      if (!valid) {
        console.error('The "keyboardSettings.common.size" parameter must be of type `number`.');
        return DEFAULT_KEYBOARD_SETTINGS;
      }

      const animation = v.animation;
      valid = validateObject(animation);
      if (!valid) {
        console.error('The "keyboardSettings.animation" parameter must be of type `object`.');
        return DEFAULT_KEYBOARD_SETTINGS;
      }
      valid = validateObject(animation.transition);
      if (!valid) {
        console.error('The "keyboardSettings.animation.transition" parameter must be of type `object`.');
        return DEFAULT_KEYBOARD_SETTINGS;
      }
      valid = validateInt(animation.transition.focusedScroller);
      if (!valid) {
        console.error('The "keyboardSettings.animation.transition.focusedScroller" parameter must be of type `number`.');
        return DEFAULT_KEYBOARD_SETTINGS;
      }
      valid = validateInt(animation.transition.in);
      if (!valid) {
        console.error('The "keyboardSettings.animation.transition.in" parameter must be of type `number`.');
        return DEFAULT_KEYBOARD_SETTINGS;
      }
      valid = validateInt(animation.transition.out);
      if (!valid) {
        console.error('The "keyboardSettings.animation.transition.out" parameter must be of type `number`.');
        return DEFAULT_KEYBOARD_SETTINGS;
      }

      const preset = v.preset;
      valid = validateArray(preset);
      if (!valid) {
        console.error('The "keyboardSettings.preset" parameter must be of type `Array<IKeyboardPreset>`.');
        return DEFAULT_KEYBOARD_SETTINGS;
      }
      for (let i = 0, l = preset.length; i < l; i++) {
        const p = preset[i];
        valid = validateObject(p);
        if (!valid) {
          console.error('The "keyboardSettings.preset[index]" parameter must be of type `IKeyboardPreset`.');
          return DEFAULT_KEYBOARD_SETTINGS;
        }
        valid = validateString(p.locale);
        if (!valid) {
          console.error('The "keyboardSettings.preset[index].locale" parameter must be of type `string`.');
          return DEFAULT_KEYBOARD_SETTINGS;
        }
        valid = validateArray(p.charset);
        if (!valid) {
          console.error('The "keyboardSettings.preset[index].charset" parameter must be of type `Array<IKeyboardCharset>`.');
          return DEFAULT_KEYBOARD_SETTINGS;
        }
        for (let j = 0, l1 = p.charset.length; j < l1; j++) {
          const c = p.charset[j];
          valid = validateObject(c);
          if (!valid) {
            console.error('The "keyboardSettings.preset[index].charset[index]" parameter must be of type `IKeyboardCharset`.');
            return DEFAULT_KEYBOARD_SETTINGS;
          }
          valid = validateString(c.name);
          if (!valid) {
            console.error('The "keyboardSettings.preset[index].charset[index].name" parameter must be of type `string`.');
            return DEFAULT_KEYBOARD_SETTINGS;
          }
          valid = validateString(c.type);
          if (!valid) {
            console.error('The "keyboardSettings.preset[index].charset[index].type" parameter must be of type `type`.');
            return DEFAULT_KEYBOARD_SETTINGS;
          }
          valid = validateArray(c.keys);
          if (!valid) {
            console.error('The "keyboardSettings.preset[index].charset[index].keys" parameter must be of type `Array<Array<KeyboardKey>>`.');
            return DEFAULT_KEYBOARD_SETTINGS;
          }
          for (let k = 0, l2 = c.keys.length; k < l2; k++) {
            const keys = c.keys[k];
            valid = validateArray(keys);
            if (!valid) {
              console.error('The "keyboardSettings.preset[index].charset[index].keys[index]" parameter must be of type `Array<KeyboardKey>`.');
              return DEFAULT_KEYBOARD_SETTINGS;
            }
            for (let m = 0, l3 = keys.length; m < l3; m++) {
              const key = keys[m];
              valid = (validateInt((key as any)?.value, true) || validateString((key as any)?.value, true, true) || (key as any)?.value === null) || (validateObject(key as any) && validateString((key as any)?.class, true, true) && (validateInt((key as any)?.value, true) || validateString((key as any)?.value, true, true) || (key as any)?.value === null));
              if (!valid) {
                console.error('The "keyboardSettings.preset[index].charset[index].keys[index][index]" parameter must be of type `KeyboardKey`.');
                return DEFAULT_KEYBOARD_SETTINGS;
              }
            }
          }
        }
      }
      return v;
    },
  } as any;

  /**
   * Sets settings for the virtual keyboard.
   */
  keyboardSettings = input<IKeyboardSettings>(DEFAULT_KEYBOARD_SETTINGS, { ...this._keyboardSettingsOptions });

  protected _contentClasses: Signal<{ [className: string]: boolean; }>;

  protected _contentStyle: Signal<{ [styleName: string]: any }>;

  protected _keyboardStyles: Signal<{ [styleName: string]: any }>;

  protected _isVertical: Signal<boolean>;

  protected _contentOffset = signal<number>(0);

  protected _keyboardShown = signal<boolean>(false);

  protected _keyboardPosition: Signal<KeyboardPosition>;

  private _$hostScroll = new Subject<IFocusedObject | null>();
  protected $hostScroll = this._$hostScroll.asObservable();

  constructor() {
    super();
    this._controlService.initialize(this._id, this._parentService?.id ?? -1, this.host);

    this._keyboardPosition = computed(() => {
      return this.keyboardSettings().common.position;
    });

    this._contentClasses = computed(() => {
      const position = this._keyboardPosition();
      return { [position]: true };
    });

    this._isVertical = computed(() => {
      const position = this._keyboardPosition();
      return position === KeyboardPositions.TOP || position === KeyboardPositions.BOTTOM;
    });

    this._contentStyle = computed(() => {
      const position = this._keyboardPosition(), { width, height } = this._bounds() ?? { width: 0, height: 0 },
        contentOffset = this._contentOffset();
      switch (position) {
        case KeyboardPositions.LEFT:
        case KeyboardPositions.RIGHT:
        case KeyboardPositions.TOP: {
          return { width: `${width}${PX}`, height: `${height}${PX}` };
        }
        case KeyboardPositions.BOTTOM:
        default: {
          return { width: `${width}${PX}`, height: `${height - contentOffset}${PX}`, paddingTop: `${contentOffset}${PX}` };
        }
      }
    });

    this._keyboardStyles = computed(() => {
      const keyboardSettings = this.keyboardSettings(), size = keyboardSettings.common.size, position = keyboardSettings.common.position;
      return {
        width: position === KeyboardPositions.LEFT || position === KeyboardPositions.RIGHT ? `${size}${PX}` : '100%',
        height: position === KeyboardPositions.TOP || position === KeyboardPositions.BOTTOM ? `${size}${PX}` : '100%'
      };
    });

    const $scroller = toObservable(this._scrollerComponent).pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
    ),
      $content = $scroller.pipe(
        takeUntilDestroyed(this._destroyRef),
        map(v => v.host),
      ), $wheelEmitter = $content;

    $wheelEmitter.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      switchMap(content => {
        return fromEvent<WheelEvent>(content, WHEEL, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (e.cancelable) {
              e.preventDefault();
            }
          }),
        );
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      switchMap(content => {
        return fromEvent<MouseEvent>(content, MOUSE_DOWN, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (e.cancelable) {
              e.preventDefault();
            }
          }),
        );
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      switchMap(content => {
        return fromEvent<MouseEvent>(content, MOUSE_MOVE, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (e.cancelable) {
              e.preventDefault();
            }
          }),
        );
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      switchMap(content => {
        return fromEvent<MouseEvent>(content, MOUSE_UP, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (e.cancelable) {
              e.preventDefault();
            }
          }),
        );
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      switchMap(content => {
        return fromEvent<TouchEvent>(content, TOUCH_START, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (e.cancelable) {
              e.preventDefault();
            }
          }),
        );
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      switchMap(content => {
        return fromEvent<TouchEvent>(content, TOUCH_MOVE, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (e.cancelable) {
              e.preventDefault();
            }
          }),
        );
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      switchMap(content => {
        return fromEvent<TouchEvent>(content, TOUCH_END, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (e.cancelable) {
              e.preventDefault();
            }
          }),
        );
      }),
    ).subscribe();

    const $keyboardSettings = toObservable(this.keyboardSettings);
    $keyboardSettings.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      tap(keyboardSettings => {
        const scroller = this._scrollerComponent()!;
        this._controlService.focus({
          id: -1, element: this._elementRef.nativeElement,
          type: scroller.type ?? ScrollerTypes.SCROLL_VIEW_SCROLLER,
          scroller, animated: false,
        });
      }),
    ).subscribe();

    this._controlService.$focusedElement.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(e => !!e),
      switchMap(e => this.updateKeyboardPosition(e, this.keyboardEnabled(), this.keyboardSettings(), e.animated ?? true)),
      filter(e => e.visible),
      switchMap(e => {
        return this._controlService.$overscrollCanceled.pipe(
          takeUntilDestroyed(this._destroyRef),
          skipUntil(timer(100).pipe(switchMap(() => of(true)))),
          tap(event => {
            const scroller = this._scrollerComponent()!;
            this._controlService.focus({
              id: -1, element: this._elementRef.nativeElement,
              type: scroller.type ?? ScrollerTypes.SCROLL_VIEW_SCROLLER,
              scroller,
            });
          }),
        );
      }),
    ).subscribe();

    this.$hostScroll.pipe(
      takeUntilDestroyed(this._destroyRef),
      tap(e => {
        this.hostScrollTo(e);
      }),
      debounceTime(250),
      tap(e => {
        this.hostScrollTo(e);
      }),
    ).subscribe();

    combineLatest([$scroller, $keyboardSettings]).pipe(
      takeUntilDestroyed(),
      filter(([s, k]) => !!s && !!k),
      switchMap(([scroller, keyboardSettings]) => {
        return combineLatest([scroller.$scroll, scroller.$resizeContent, scroller.$resizeViewport]).pipe(
          tap(() => {
            this._contentOffset.set((this._isVertical() ? scroller.verticalScrollRatio : scroller.horizontalScrollRatio) * keyboardSettings.common.size * keyboardSettings.common.scrollerOffsetWhenFocused);
          }),
        );
      }),
    ).subscribe();
  }

  private updateKeyboardPosition(e: IFocusedObject, keyboardEnabled: boolean, keyboardSettings: IKeyboardSettings, animated: boolean = true) {
    const scrollerComponent = this._scrollerComponent();
    if (!!scrollerComponent) {
      if (!!e && !!e.element) {
        const target = e.element, targetTagName = target.tagName?.toLocaleLowerCase();
        if (!!targetTagName && isInteractive(targetTagName)) {
          if (keyboardEnabled && target.blur instanceof Function) {
            target.blur();
          }
          const scroller = e.scroller;
          if (!!scroller) {
            this._keyboardShown.set(true);
            this.updateKeyboardAnimation(e, keyboardEnabled, keyboardSettings, animated);
            this._$hostScroll.next(e);
          }
          return of({ visible: true, target });
        }
      }
      const scrollParams: IScrollToParams = {
        behavior: animated && keyboardSettings.animation.transition.in > 0 ? BEHAVIOR_AUTO : BEHAVIOR_INSTANT,
        duration: animated ? keyboardSettings.animation.transition.out : 0
      };
      switch (keyboardSettings.common.position) {
        case KeyboardPositions.LEFT: {
          scrollParams.left = scrollerComponent.scrollWidth;
          break;
        }
        case KeyboardPositions.RIGHT: {
          scrollParams.left = 0;
          break;
        }
        case KeyboardPositions.TOP: {
          scrollParams.top = scrollerComponent.scrollHeight;
          break;
        }
        case KeyboardPositions.BOTTOM:
        default: {
          scrollParams.top = 0;
          break;
        }
      }
      this._keyboardShown.set(false);
      scrollerComponent.scrollTo(scrollParams) ?? null;
    }
    return of({ visible: false, target: null });
  }

  private updateKeyboardAnimation(e: IFocusedObject, keyboardEnabled: boolean, keyboardSettings: IKeyboardSettings,
    animated: boolean = true) {
    if (keyboardEnabled) {
      const scrollParams: IScrollToParams = {
        behavior: animated && keyboardSettings.animation.transition.in > 0 ? BEHAVIOR_AUTO : BEHAVIOR_INSTANT,
        duration: animated ? keyboardSettings.animation.transition.out : 0, onUpdate: () => {
          this.hostScrollTo(e, true, animated);
        }, onComplete: () => {
          this.hostScrollTo(e, true, animated);
        }
      };
      switch (keyboardSettings.common.position) {
        case KeyboardPositions.LEFT: {
          scrollParams.left = this.scrollWidth - keyboardSettings.common.size;
          break;
        }
        case KeyboardPositions.RIGHT: {
          scrollParams.left = keyboardSettings.common.size;
          break;
        }
        case KeyboardPositions.TOP: {
          scrollParams.top = this.scrollTop - keyboardSettings.common.size;
          break;
        }
        case KeyboardPositions.BOTTOM:
        default: {
          scrollParams.top = keyboardSettings.common.size;
          break;
        }
      }
      this.scrollTo(scrollParams);
    }
  }

  private hostScrollTo(e: IFocusedObject | null, blending: boolean = false, animated: boolean = true) {
    if (!!e && !!e.element) {
      const target = e.element,
        scroller = e.scroller,
        { width: targetWidth, height: targetHeight } = target.getBoundingClientRect();
      let offsetTop = target.offsetTop, offsetLeft = target.offsetLeft;
      if (!!scroller) {
        let s = scroller.service, hostService: INtBaseScrollViewService | null = null;
        while (true) {
          if (!!s?.scrollView?.parent?.host) {
            const { left, top } = s.scrollView.parent.host.getBoundingClientRect();
            offsetLeft += left
            offsetTop += top;
          }
          if (s === this._service) {
            break;
          }
          hostService = s ?? null;
          s = s.parent;
          if (!s?.scrollView) {
            break;
          }
        }
        const keyboardSettings = this.keyboardSettings(), position = this._keyboardPosition(),
          { width: scrollerViewportWidth, height: scrollerViewportHeight } = this._scrollerComponent()?.viewportBounds() ?? { width: 0, height: 0 };
        let x: number, y: number;

        switch (position) {
          case KeyboardPositions.LEFT: {
            x = offsetLeft + (keyboardSettings.common.size + keyboardSettings.common.focusedTargetOffset);
            break;
          }
          case KeyboardPositions.TOP: {
            y = offsetTop + (keyboardSettings.common.size + keyboardSettings.common.focusedTargetOffset);
            break;
          }
          case KeyboardPositions.RIGHT: {
            x = (offsetLeft + targetWidth + keyboardSettings.common.focusedTargetOffset) - (scrollerViewportWidth - keyboardSettings.common.size);
            break;
          }
          case KeyboardPositions.BOTTOM:
          default: {
            y = (offsetTop + targetHeight + keyboardSettings.common.focusedTargetOffset) - (scrollerViewportHeight - keyboardSettings.common.size);
            break;
          }
        }

        hostService?.scrollView?.stopScrolling(true);
        hostService?.scrollView?.scroll({
          x: x!, y: y!, behavior: animated && keyboardSettings.animation.transition.focusedScroller > 0 ? BEHAVIOR_AUTO : BEHAVIOR_INSTANT,
          blending, duration: animated ? keyboardSettings.animation.transition.focusedScroller : 0,
          userAction: true,
        });
      }
    }
  }
}