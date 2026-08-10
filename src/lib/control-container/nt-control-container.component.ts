import { Component, computed, ElementRef, inject, input, Signal, signal, TemplateRef, viewChild, ViewEncapsulation } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { combineLatest, debounceTime, delay, filter, fromEvent, map, of, skipUntil, Subject, switchMap, tap, timer } from "rxjs";
import { INtScrollViewService, NtScrollViewComponent, NtScrollViewService } from "../scroll-view";
import {
  CONTROL_CONTAINER_SERVICE, ElementNames, IKeyboardSettings, INtBaseControlContainerService, KeyboardKeys, KeyboardPosition, KeyboardPositions,
  SCROLL_VIEW_OVERSCROLL_ENABLED, SCROLL_VIEW_SERVICE, SCROLL_VIEW_USER_INTERACTION_ENABLED,
} from "../common";
import { FOCUS, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, TOUCH_END, TOUCH_MOVE, TOUCH_START, WHEEL } from "../common/const/event-names";
import { NtControlContainerService } from "./nt-control-container.service";
import { INtBaseScrollViewService } from "../common/interfaces/nt-base-scroll-view-service";
import { isInteractive } from "../common/utils/is-interactive";
import { ScrollerTypes } from "../common/enums/scroller-types";
import { IFocusedObject } from "../common/interfaces/focused-object";
import { validateArray, validateBoolean, validateInt, validateObject, validateString } from "../common/utils";
import { DEFAULT_EXCLUDE_ELEMETN_LIST } from "../drawer-container/const";
import { DEFAULT_KEYBOARD_ENABLED, NT_VALUE } from "./const";
import { DEFAULT_KEYBOARD_SETTINGS, KEY_LAYOUT, KEY_SYS } from '../common/const/keyboard';
import { BEHAVIOR_AUTO, BEHAVIOR_INSTANT } from "../common/const/behavior";
import { IScrollToParams } from "../common/interfaces/scroll-to-params";
import { PX } from "../common/const/base-prop-names";
import { NtKeyboardService } from "../keyboard/nt-keyboard.service";
import { normalizeValueForTextField } from "./utils/normalize-value-for-text-field";
import { TextFieldTypes } from "./enums";
import { ATTR_DIR, ATTR_PATTERN, ATTR_TYPE, NT_DIR } from "../common/const/attribute-names";
import { DEFAULT_INPUT_ELEMETNS } from "../common/directives/nt-control/const";

/**
 * NtControlContainerComponent
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
    NtKeyboardService,
  ],
})
export class NtControlContainerComponent extends NtScrollViewComponent<INtScrollViewService, INtScrollViewService> {
  protected _containerComponent = viewChild<ElementRef<HTMLDivElement>>('container');

  protected _controlService = inject<INtBaseControlContainerService>(CONTROL_CONTAINER_SERVICE);

  protected _keyboardService = inject(NtKeyboardService);

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
        valid = validateArray(p.layout);
        if (!valid) {
          console.error('The "keyboardSettings.preset[index].layout" parameter must be of type `Array<IKeyboardLayout>`.');
          return DEFAULT_KEYBOARD_SETTINGS;
        }
        for (let j = 0, l1 = p.layout.length; j < l1; j++) {
          const c = p.layout[j];
          valid = validateObject(c);
          if (!valid) {
            console.error('The "keyboardSettings.preset[index].layout[index]" parameter must be of type `IKeyboardLayout`.');
            return DEFAULT_KEYBOARD_SETTINGS;
          }
          valid = validateString(c.name);
          if (!valid) {
            console.error('The "keyboardSettings.preset[index].layout[index].name" parameter must be of type `string`.');
            return DEFAULT_KEYBOARD_SETTINGS;
          }
          valid = validateArray(c.type);
          if (!valid) {
            console.error('The "keyboardSettings.preset[index].layout[index].type" parameter must be of type `Array<string>`.');
            return DEFAULT_KEYBOARD_SETTINGS;
          }
          for (const t of c.type) {
            valid = validateString(t);
            if (!valid) {
              console.error('The "keyboardSettings.preset[index].layout[index].type[index]" parameter must be of type `string`.');
              return DEFAULT_KEYBOARD_SETTINGS;
            }
          }
          valid = validateArray(c.keys);
          if (!valid) {
            console.error('The "keyboardSettings.preset[index].layout[index].keys" parameter must be of type `Array<Array<KeyboardKey>>`.');
            return DEFAULT_KEYBOARD_SETTINGS;
          }
          for (let k = 0, l2 = c.keys.length; k < l2; k++) {
            const keys = c.keys[k];
            valid = validateArray(keys);
            if (!valid) {
              console.error('The "keyboardSettings.preset[index].layout[index].keys[index]" parameter must be of type `Array<KeyboardKey>`.');
              return DEFAULT_KEYBOARD_SETTINGS;
            }
            for (let m = 0, l3 = keys.length; m < l3; m++) {
              const key = keys[m];
              valid = (validateInt((key as any)?.value, true) || validateString((key as any)?.value, true, true) || (key as any)?.value === null) || (validateObject(key as any) && validateString((key as any)?.class, true, true) && (validateInt((key as any)?.value, true) || validateString((key as any)?.value, true, true) || (key as any)?.value === null));
              if (!valid) {
                console.error('The "keyboardSettings.preset[index].layout[index].keys[index][index]" parameter must be of type `KeyboardKey`.');
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

    const $keyClick = this._keyboardService.$keyPress,
      $focusedElement = this._controlService.$focusedElement,
      $keyboardEnabled = toObservable(this.keyboardEnabled);

    $keyboardEnabled.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      switchMap(() => {
        return fromEvent(this._elementRef.nativeElement, FOCUS, { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(e => {
            if (!!e) {
              if (e.cancelable) {
                e.stopImmediatePropagation();
                e.preventDefault();
              }
            }
          }),
        );
      }),
    ).subscribe();

    let prevFocusedElement: HTMLElement | null = null;
    combineLatest([$keyboardEnabled, this._keyboardService.$latgTextDir, $focusedElement.pipe(
      takeUntilDestroyed(),
      tap(element => {
        const el = element?.element ?? null;
        if (el !== prevFocusedElement) {
          if (!!el && !isInteractive(el.tagName)) {
            if (typeof el.focus === 'function') {
              el.focus({ preventScroll: true });
            }
          }
        }
      }),
    )]).pipe(
      takeUntilDestroyed(),
      filter(([keyboardEnabled]) => !!keyboardEnabled),
      tap(([, dir, element]) => {
        const el = element?.element ?? null;
        if (!!prevFocusedElement && el !== prevFocusedElement) {
          const ntDir = prevFocusedElement.getAttribute(NT_DIR);
          if (ntDir) {
            prevFocusedElement.setAttribute(ATTR_DIR, ntDir);
          } else {
            prevFocusedElement.removeAttribute(NT_DIR);
            prevFocusedElement.removeAttribute(ATTR_DIR);
          }
        }
        if (!!el) {
          if (!!el && DEFAULT_INPUT_ELEMETNS.indexOf(el.tagName?.toLowerCase()) > -1) {
            const nodeDir = el.getAttribute(ATTR_DIR),
              ntDir = el.getAttribute(NT_DIR);
            if (nodeDir) {
              if (!ntDir) {
                el.setAttribute(NT_DIR, nodeDir);
              }
            } else {
              el.removeAttribute(NT_DIR);
            }
            el.dir = dir;
          }
        }
        prevFocusedElement = el;
      }),
    ).subscribe();

    $keyboardEnabled.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      switchMap(() => {
        return $keyClick.pipe(
          takeUntilDestroyed(this._destroyRef),
          filter(key => !!key),
          tap(key => {
            const element = this._controlService?.focusedElement?.element ?? null, targetTagName = element?.tagName?.toLowerCase();
            if (!!targetTagName && isInteractive(targetTagName)) {
              const inputElement = element as HTMLInputElement;
              if (!!inputElement) {
                const keyValue = key as string, ngControl = this._controlService?.focusedElement?.ngControl ?? null,
                  ngControlValue = ngControl?.control?.value ?? null,
                  isNgControl = ngControlValue !== null,
                  ntValue = inputElement.getAttribute(NT_VALUE);
                let value = String(ngControlValue ?? ntValue ?? inputElement.value ?? '');
                if (keyValue.indexOf(KEY_SYS) === 0) {
                  if (keyValue === KeyboardKeys.SYS_NEXT_LOCALE) {
                    this._keyboardService.nextPreset();
                  }
                } else if (keyValue.indexOf(KEY_LAYOUT) === 0) {
                  const preset = this._keyboardService.preset,
                    index = (preset?.layout?.findIndex(v => (v?.name ? `${KEY_LAYOUT}${(v.name)}` : null) === keyValue && keyValue !== null) ?? -1),
                    isLayout = index > -1;
                  if (isLayout) {
                    this._keyboardService.nextLayout({ index });
                  }
                } else if (keyValue.indexOf(KEY_SYS) === -1) {
                  switch (keyValue) {
                    case KeyboardKeys.BACK_SPACE: {
                      value = value.length > 0 ? value.slice(0, value.length - 1) : '';
                      break;
                    }
                    case KeyboardKeys.SPACE: {
                      value += ' ';
                      break;
                    }
                    case KeyboardKeys.SYS_NEXT_LOCALE:
                    case KeyboardKeys.CAPS_LOCK:
                    case KeyboardKeys.ALT:
                    case KeyboardKeys.CTRL:
                    case KeyboardKeys.NUM_LOCK:
                    case KeyboardKeys.INSERT:
                    case KeyboardKeys.END:
                    case KeyboardKeys.HOME:
                    case KeyboardKeys.ARROW_LEFT:
                    case KeyboardKeys.ARROW_RIGHT:
                    case KeyboardKeys.ARROW_UP:
                    case KeyboardKeys.ARROW_DOWN:
                    case KeyboardKeys.PAGE_LEFT:
                    case KeyboardKeys.PAGE_RIGHT:
                    case KeyboardKeys.PAGE_UP:
                    case KeyboardKeys.PAGE_DOWN:
                    case KeyboardKeys.SHIFT: {
                      // skip
                      break;
                    }
                    case KeyboardKeys.CLEAR: {
                      value = '';
                      break;
                    }
                    case KeyboardKeys.ENTER: {
                      this.blur();
                      break;
                    }
                    case KeyboardKeys.ESCAPE: {
                      this.blur();
                      break;
                    }
                    default: {
                      if (keyValue.length === 1) {
                        value += keyValue;
                      }
                      break;
                    }
                  }
                  (this._controlService as any).input = keyValue;
                  const type = inputElement.getAttribute(ATTR_TYPE) ?? TextFieldTypes.TEXT,
                    pattern = inputElement.getAttribute(ATTR_PATTERN) ?? null,
                    { normalizedValue, normalizedNtValue } = normalizeValueForTextField(type, value, ntValue, keyValue, pattern, isNgControl);
                  inputElement.setAttribute(NT_VALUE, normalizedNtValue ?? '');
                  inputElement.value = normalizedValue;
                  if (!!ngControl?.control) {
                    ngControl.control.setValue(normalizedValue);
                  }
                }
              }
            }
          }),
          delay(0),
          tap(() => {
            (this._controlService as any).input = null;
          }),
        );
      }),
    ).subscribe();

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
        this.blur(false);
      }),
    ).subscribe();

    $focusedElement.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(e => !!e),
      switchMap(e => this.updateKeyboardPosition(e, this.keyboardEnabled(), this.keyboardSettings(), e.animated ?? true)),
      filter(e => e.visible),
      switchMap(e => {
        return this._controlService.$overscrollCanceled.pipe(
          takeUntilDestroyed(this._destroyRef),
          skipUntil(timer(100).pipe(switchMap(() => of(true)))),
          tap(event => {
            this.blur();
          }),
        );
      }),
    ).subscribe();

    $scroller.pipe(
      takeUntilDestroyed(),
      filter(s => !!s),
      switchMap(scroller => {
        return combineLatest([scroller.$scroll, scroller.$resizeViewport.pipe(
          takeUntilDestroyed(this._destroyRef),
          debounceTime(100),
        )]).pipe(
          tap(() => {
            const keyboardSettings = this.keyboardSettings();
            this._contentOffset.set((this._isVertical() ? scroller.verticalScrollRatio : scroller.horizontalScrollRatio) * keyboardSettings.common.size * keyboardSettings.common.scrollerOffsetWhenFocused);
          }),
        );
      }),
    ).subscribe();
  }

  ngOnInit() {
    this._controlService.initialize(this._id, this._parentService?.id ?? -1, this.keyboardEnabled() ? this.host : window as any);
  }

  private updateKeyboardPosition(e: IFocusedObject, keyboardEnabled: boolean, keyboardSettings: IKeyboardSettings, animated: boolean = true) {
    const scrollerComponent = this._scrollerComponent();
    if (!!scrollerComponent) {
      if (!!e && !!e.element) {
        const target = e.element, targetTagName = target.tagName?.toLowerCase();
        if (!!targetTagName && isInteractive(targetTagName)) {
          if (keyboardEnabled && target.blur instanceof Function) {
            target.blur();
          } else if (!keyboardEnabled && target.focus instanceof Function) {
            target.focus();
          }
          const type = target.getAttribute(ATTR_TYPE) ?? null;
          if (!!type) {
            this._keyboardService.nextLayout({ type });
          }
          const scroller = e.scroller;
          if (!!scroller) {
            if (keyboardEnabled) {
              this._keyboardShown.set(true);
            }
            this.updateKeyboardAnimation(e, keyboardEnabled, keyboardSettings, animated);
            this._$hostScroll.next(e);
          }
          return of({ visible: true, target });
        }
      }
      const behavior = animated && keyboardSettings.animation.transition.in > 0 ? BEHAVIOR_AUTO : BEHAVIOR_INSTANT,
        scrollParams: IScrollToParams = {
          behavior,
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
      if (keyboardEnabled) {
        this._keyboardShown.set(false);
      }
      scrollerComponent.scrollTo(scrollParams) ?? null;
      if (behavior === BEHAVIOR_INSTANT) {
        scrollerComponent.refresh(true);
      }
      if (!!e) {
        this._$hostScroll.next(e);
      }
    }
    return of({ visible: false, target: null });
  }

  private updateKeyboardAnimation(e: IFocusedObject, keyboardEnabled: boolean, keyboardSettings: IKeyboardSettings,
    animated: boolean = true) {
    if (keyboardEnabled) {
      const behavior = animated && keyboardSettings.animation.transition.in > 0 ? BEHAVIOR_AUTO : BEHAVIOR_INSTANT,
        scrollParams: IScrollToParams = {
          behavior,
          duration: animated ? keyboardSettings.animation.transition.out : 0, onUpdate: () => {
            this.hostScrollTo(e, true, animated);
          }, onComplete: () => {
            this.hostScrollTo(e, true, animated);
          }
        };

      this.hostScrollTo(e, true, animated);
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
      if (behavior === BEHAVIOR_INSTANT) {
        this._scrollerComponent()?.refresh(true);
      }
    }
  }

  private hostScrollTo(e: IFocusedObject | null, blending: boolean = false, animated: boolean = true) {
    if (!!e && !!e.element) {
      const target = e.element,
        scroller = e.scroller,
        position = this._keyboardPosition(),
        useOffsets = position === KeyboardPositions.LEFT || position === KeyboardPositions.TOP,
        { left, top, width: targetWidth, height: targetHeight } = target.getBoundingClientRect();
      let offsetTop = top, offsetLeft = left;
      if (!!scroller) {
        let s = scroller.service, hostService: INtBaseScrollViewService | null = null;
        while (true) {
          if (!!s?.scrollView?.parent?.host) {
            offsetLeft += useOffsets ? (s?.scrollView.scrollLeft - s.scrollView.offsetLeft) : s?.scrollView.scrollLeft;
            offsetTop += useOffsets ? (s?.scrollView.scrollTop - s.scrollView.offsetTop) : s?.scrollView.scrollTop;
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

        const keyboardSettings = this.keyboardSettings(),
          { width: scrollerViewportWidth, height: scrollerViewportHeight } = this._scrollerComponent()?.viewportBounds() ?? { width: 0, height: 0 };
        let x: number, y: number;

        switch (position) {
          case KeyboardPositions.LEFT: {
            x = offsetLeft - keyboardSettings.common.size - keyboardSettings.common.focusedTargetOffset;
            break;
          }
          case KeyboardPositions.TOP: {
            y = offsetTop - keyboardSettings.common.size - keyboardSettings.common.focusedTargetOffset;
            break;
          }
          case KeyboardPositions.RIGHT: {
            x = (offsetLeft + targetWidth + keyboardSettings.common.focusedTargetOffset) - scrollerViewportWidth;
            break;
          }
          case KeyboardPositions.BOTTOM:
          default: {
            y = (offsetTop + targetHeight + keyboardSettings.common.focusedTargetOffset) - scrollerViewportHeight;
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

  private blur(animated: boolean = true) {
    const scroller = this._scrollerComponent();
    if (!!scroller) {
      const element = this._controlService.focusedElement?.element ?? null;
      if (!!element) {
        if (DEFAULT_INPUT_ELEMETNS.indexOf(element.tagName?.toLowerCase()) > -1) {
          const ntDir = element.getAttribute(NT_DIR);
          if (ntDir) {
            element.setAttribute(ATTR_DIR, ntDir);
          } else {
            element.removeAttribute(ATTR_DIR);
          }
          element.removeAttribute(NT_DIR);
        }
      }
      this._controlService.focus({
        id: -1,
        element: null,
        ngControl: null,
        type: scroller.type ?? ScrollerTypes.SCROLL_VIEW_SCROLLER,
        scroller: null, animated,
      });
    }
  }
}