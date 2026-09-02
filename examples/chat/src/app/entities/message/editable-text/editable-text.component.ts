import { Component, computed, DestroyRef, effect, ElementRef, inject, input, OnDestroy, output, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, fromEvent, map, of, switchMap, tap } from 'rxjs';
import { SearchHighlightDirective } from '@shared/directives';
import { formatText } from '@shared/utils';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { LocaleSensitiveDirective } from '@shared/localization';
import { getTextUrls } from '@shared/utils/text/format-text.util';
import { resourceManager } from '@shared/utils/resource-manager';
import { ResourceManagerEvents } from '@shared/utils/resource-manager/resource-manager';
import { ISize, NtControlModule } from 'centrifugal';

const DEFAULT_SEARCH_SUBSTRING_CLASS = 'search-substring',
  INITIAL = 'initial',
  USER_SELECT = 'user-select',
  WEBKIT_USER_SELECT = '-webkit-user-select',
  MOZ_USER_SELECT = '-moz-user-select',
  DEFAULT_TEXTAREA_SIZE = 16,
  MAX_TEXTAREA_HEIGHT = 320,
  CLASS_REMOVAL = 'removal',
  CLASS_SELECTED = 'selected',
  CLASS_FOCUSED = 'focused',
  HIDDEN = 'hidden',
  AUTO = 'auto',
  NONE = 'none',
  FOCUS = 'focus',
  BLUR = 'blur';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-editable-text',
  imports: [CommonModule, SearchHighlightDirective, NtControlModule, LocaleSensitiveDirective, CdkTextareaAutosize],
  templateUrl: './editable-text.component.html',
  styleUrl: './editable-text.component.scss',
})
export class EditableTextComponent implements OnDestroy {
  readonlyText = viewChild<ElementRef<HTMLSpanElement>>('readonlyText');

  editor = viewChild<ElementRef<HTMLDivElement>>('editor');

  textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  editing = input<boolean>(false);

  text = input<string>();

  classes = input<{ [className: string]: boolean; }>();

  presetName = input<'message' | 'quote'>('message');

  singleline = input<boolean>(false);

  mailed = input<boolean>(false);

  time = input<string | undefined>();

  themeType = input.required<'in' | 'out'>();

  searchSubstringClass = input<string>(DEFAULT_SEARCH_SUBSTRING_CLASS);

  searchPattern = input<Array<string>>();

  selectable = input<boolean>(false);

  textAreaClick = output<Event>();

  textClick = output<Event>();

  changeText = output<string | undefined>();

  keydown = output<KeyboardEvent>();

  onImageLoaded = output<void>();

  formattedText = signal<string>('');

  theme: Signal<ITheme | undefined>;

  private _destroyRef = inject(DestroyRef);

  private _themeService = inject(ThemeService);

  linkNormalColor = signal<string>(INITIAL);

  linkVisitedColor = signal<string>(INITIAL);

  linkHoverColor = signal<string>(INITIAL);

  linkActiveColor = signal<string>(INITIAL);

  commentColor = signal<string>(INITIAL);

  commentBackground = signal<string>(INITIAL);

  searchSubstringBackground = signal<string>(INITIAL);

  messageStatusColor = signal<string>(INITIAL);

  focused = signal<boolean>(false);

  scrolled = signal<boolean>(false);

  readonlyStyles: Signal<{ [sName: string]: string }>;

  private _resizeObserver: ResizeObserver | undefined;

  bounds = signal<ISize>({
    width: this.textarea()?.nativeElement?.offsetWidth || DEFAULT_TEXTAREA_SIZE,
    height: this.textarea()?.nativeElement?.offsetHeight || DEFAULT_TEXTAREA_SIZE,
  });

  private _onContainerResizeHandler = () => {
    const el = this.textarea()?.nativeElement as HTMLTextAreaElement;
    if (el && el.offsetWidth && el.offsetHeight) {
      this.bounds.set({ width: el.offsetWidth || DEFAULT_TEXTAREA_SIZE, height: el.offsetHeight || DEFAULT_TEXTAREA_SIZE });
    }
  }

  private _$resourceUrls = new BehaviorSubject<Array<string>>([]);
  readonly $resourceUrls = this._$resourceUrls.asObservable();

  private _$resourceLoaded = new BehaviorSubject<string>('');
  readonly $resourceLoaded = this._$resourceLoaded.asObservable();

  private _onResourceLoadedHandler = (url: string) => {
    this._$resourceLoaded.next(url);
  };

  constructor() {
    this._resizeObserver = new ResizeObserver(this._onContainerResizeHandler);
    resourceManager.addEventListener(ResourceManagerEvents.PROGRESS, this._onResourceLoadedHandler);

    const $textarea = toObservable(this.textarea).pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
    );

    $textarea.pipe(
      takeUntilDestroyed(),
      tap(textarea => {
        if (this._resizeObserver) {
          this._resizeObserver.observe(textarea, { box: "border-box" });
        }
        this._onContainerResizeHandler();
      }),
    ).subscribe();

    $textarea.pipe(
      takeUntilDestroyed(),
      switchMap(textarea => {
        return fromEvent(textarea, FOCUS).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.focused.set(true);
          }),
        );
      }),
    ).subscribe();

    $textarea.pipe(
      takeUntilDestroyed(),
      switchMap(textarea => {
        return fromEvent(textarea, BLUR).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.focused.set(false);
          }),
        );
      }),
    ).subscribe();

    this.theme = toSignal(this._themeService.$theme);

    this.readonlyStyles = computed(() => {
      const selectable = this.selectable(), val = selectable ? AUTO : NONE;
      return { [USER_SELECT]: val, [WEBKIT_USER_SELECT]: val, [MOZ_USER_SELECT]: val };
    });

    effect(() => {
      const bounds = this.bounds(), textarea = this.textarea()?.nativeElement as HTMLTextAreaElement;
      if (bounds && textarea) {
        textarea.style.overflow = bounds.height < MAX_TEXTAREA_HEIGHT ? HIDDEN : AUTO;

        this.scrolled.set(bounds.height >= MAX_TEXTAREA_HEIGHT);
      }
    });

    effect(() => {
      const theme = this.theme(), type = this.themeType();
      if (theme) {
        const preset = this._themeService.getPreset(theme.chat.messages.message.content[type]);
        if (preset) {
          this.searchSubstringBackground.set(preset.searchSubstringColor);
        }
      }
    });

    effect(() => {
      const theme = this.theme(), type = this.themeType();
      if (theme) {
        const preset = this._themeService.getPreset(theme.chat.messages.message.content[type]);
        if (preset) {
          this.messageStatusColor.set(preset.statusColor);
        }
      }
    });

    effect(() => {
      const classes = this.classes(), type = this.themeType(), currentTheme = this.theme();
      if (classes) {
        const preset = (this._themeService.getPreset(currentTheme?.chat?.messages?.[this.presetName()] as any)?.content?.[type]);
        if (preset) {
          if (classes[CLASS_REMOVAL] && classes[CLASS_SELECTED]) {
            this.messageStatusColor.set(preset.removalSelected.statusColor);
          } else if (classes[CLASS_REMOVAL]) {
            this.messageStatusColor.set(preset.removal.statusColor);
          } else if (classes[CLASS_SELECTED] && classes[CLASS_FOCUSED]) {
            this.messageStatusColor.set(preset.focusedSelected.statusColor);
          } else if (classes[CLASS_SELECTED]) {
            this.messageStatusColor.set(preset.selected.statusColor);
          } else if (classes[CLASS_FOCUSED]) {
            this.messageStatusColor.set(preset.focused.statusColor);
          } else {
            this.messageStatusColor.set(preset.normal.statusColor);
          }
        }
      }
    });

    effect(() => {
      const theme = this.theme(), type = this.themeType();
      if (theme) {
        const preset = this._themeService.getPreset(theme.chat.messages.message.content[type].textEditor.comment);
        if (preset) {
          this.commentColor.set(preset.color);
          this.commentBackground.set(preset.background);
        }
      }
    });

    effect(() => {
      const theme = this.theme(), type = this.themeType();
      if (theme) {
        const preset = this._themeService.getPreset(theme.chat.messages.message.content[type].textEditor.link);
        if (preset) {
          this.linkNormalColor.set(preset.normal.color);
          this.linkVisitedColor.set(preset.visited.color);
          this.linkHoverColor.set(preset.hover.color);
          this.linkActiveColor.set(preset.active);
        }
      }
    });

    effect(() => {
      const theme = this.theme(), type = this.themeType(), editor = this.editor()?.nativeElement, focus = this.focused();
      if (theme && editor) {
        const preset = this._themeService.getPreset(theme.chat.messages.message.content[type]);
        if (preset) {
          editor.style.backgroundColor = preset.editingTextBackground;
          editor.style.outline = focus ? preset.editingTextFocusedOutline : NONE;
        }
      }
    });

    const $text = toObservable(this.text),
      $time = toObservable(this.time),
      $mailed = toObservable(this.mailed),
      $selectable = toObservable(this.selectable),
      $resources = combineLatest([this.$resourceUrls, this.$resourceLoaded]).pipe(
        takeUntilDestroyed(),
        debounceTime(100),
        takeUntilDestroyed(this._destroyRef),
        switchMap(([resourceUrls, resourceLoaded]) => {
          return of(resourceUrls.includes(resourceLoaded));
        }),
      );

    $text.pipe(
      takeUntilDestroyed(),
      distinctUntilChanged(),
      filter(v => v !== undefined),
      switchMap(text => {
        return of(getTextUrls(text));
      }),
      tap(urls => {
        if (urls.length > 0) {
          for (const url of urls) {
            resourceManager.add(url);
          }
          this._$resourceUrls.next(urls);
        }
      }),
    ).subscribe();

    combineLatest([$selectable, $mailed, $text, $time, $resources]).pipe(
      takeUntilDestroyed(),
      distinctUntilChanged(),
      switchMap(([selectable, mailed, text, time, resources]) => {
        return of({
          value: formatText(text, time, {
            selectable,
            mailed,
            loading: false,
          }), loaded: resources
        }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(({ value, loaded }) => {
            if (loaded) {
              this.onImageLoaded.emit();
            }
            this.formattedText.set(value);
          }),
        );
      }),
    ).subscribe();
  }

  onTextAreaClickHandler(e: Event) {
    this.textAreaClick.emit(e);
  }

  onTextClickHandler(e: Event) {
    this.textClick.emit(e);
  }

  onKeyDownHandler(e: KeyboardEvent) {
    e.stopImmediatePropagation();

    this.keydown.emit(e);
  }

  onInputHandler(e: Event) {
    const textarea = this.textarea(), value = textarea?.nativeElement.value;
    this.changeText.emit(value);
  }

  ngOnDestroy(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = undefined;
    }
    if (this._$resourceUrls) {
      this._$resourceUrls.complete();
    }
    if (this._$resourceLoaded) {
      this._$resourceLoaded.complete();
    }

    resourceManager.removeEventListener(ResourceManagerEvents.PROGRESS, this._onResourceLoadedHandler);
  }
}
