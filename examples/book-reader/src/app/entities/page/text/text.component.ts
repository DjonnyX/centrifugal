import { Component, computed, DestroyRef, effect, ElementRef, inject, input, OnDestroy, output, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, fromEvent, map, of, switchMap, tap } from 'rxjs';
import { SearchHighlightDirective } from '@shared/directives';
import { formatText } from '@shared/utils';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { LocaleSensitiveDirective } from '@shared/localization';
import { ISize } from 'centrifugal';
import { getTextUrls } from '@shared/utils/text/format-text.util';

const DEFAULT_SEARCH_SUBSTRING_CLASS = 'search-substring',
  INITIAL = 'initial',
  USER_SELECT = 'user-select',
  WEBKIT_USER_SELECT = '-webkit-user-select',
  MOZ_USER_SELECT = '-moz-user-select',
  DEFAULT_TEXTAREA_SIZE = 16,
  MAX_TEXTAREA_HEIGHT = 320,
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
  selector: 'x-text',
  imports: [CommonModule, SearchHighlightDirective, LocaleSensitiveDirective],
  templateUrl: './text.component.html',
  styleUrl: './text.component.scss',
})
export class TextComponent implements OnDestroy {
  readonlyText = viewChild<ElementRef<HTMLSpanElement>>('readonlyText');

  editor = viewChild<ElementRef<HTMLDivElement>>('editor');

  textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  editing = input<boolean>(false);

  text = input<string>();

  classes = input<{ [className: string]: boolean; }>();

  presetName = input<'message' | 'quote'>('message');

  singleline = input<boolean>(false);

  searchSubstringClass = input<string>(DEFAULT_SEARCH_SUBSTRING_CLASS);

  searchPattern = input<Array<string>>();

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

  constructor() {
    this._resizeObserver = new ResizeObserver(this._onContainerResizeHandler);

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
      const val = NONE;
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
      const theme = this.theme();
      if (theme) {
        const preset = this._themeService.getPreset(theme.bookReader.messages.message.content);
        if (preset) {
          this.searchSubstringBackground.set(preset.searchSubstringColor);
        }
      }
    });

    effect(() => {
      const theme = this.theme();
      if (theme) {
        const preset = this._themeService.getPreset(theme.bookReader.messages.message.content);
        if (preset) {
          this.messageStatusColor.set(preset.statusColor);
        }
      }
    });

    effect(() => {
      const classes = this.classes(), currentTheme = this.theme();
      if (classes) {
        const preset = this._themeService.getPreset(currentTheme?.bookReader?.messages?.message?.content);
        if (preset) {
          this.messageStatusColor.set(preset.normal.statusColor);
        }
      }
    });

    effect(() => {
      const theme = this.theme();
      if (theme) {
        const preset = this._themeService.getPreset(theme.bookReader.messages.message.content.textEditor.comment);
        if (preset) {
          this.commentColor.set(preset.color);
          this.commentBackground.set(preset.background);
        }
      }
    });

    effect(() => {
      const theme = this.theme();
      if (theme) {
        const preset = this._themeService.getPreset(theme.bookReader.messages.message.content.textEditor.link);
        if (preset) {
          this.linkNormalColor.set(preset.normal.color);
          this.linkVisitedColor.set(preset.visited.color);
          this.linkHoverColor.set(preset.hover.color);
          this.linkActiveColor.set(preset.active);
        }
      }
    });

    effect(() => {
      const theme = this.theme(), editor = this.editor()?.nativeElement, focus = this.focused();
      if (theme && editor) {
        const preset = this._themeService.getPreset(theme.bookReader.messages.message.content);
        if (preset) {
          editor.style.backgroundColor = preset.editingTextBackground;
          editor.style.outline = focus ? preset.editingTextFocusedOutline : NONE;
        }
      }
    });

    const $text = toObservable(this.text);

    $text.pipe(
      takeUntilDestroyed(),
      distinctUntilChanged(),
      filter(v => v !== undefined),
      switchMap(text => {
        return of(getTextUrls(text));
      }),
    ).subscribe();

    $text.pipe(
      takeUntilDestroyed(),
      distinctUntilChanged(),
      switchMap(text => {
        return of({
          value: formatText(text),
        }).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(({ value }) => {
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
  }
}
