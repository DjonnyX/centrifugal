import { Component, computed, DestroyRef, effect, ElementRef, inject, input, OnDestroy, output, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, of, switchMap, tap } from 'rxjs';
import { SearchHighlightDirective } from '@shared/directives';
import { formatText } from '@shared/utils';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { LocaleSensitiveDirective } from '@shared/localization';
import { ISize } from 'centrifugal';
import { getTextUrls } from '@shared/utils/text/format-text.util';
import { resourceManager } from '@shared/utils/resource-manager';
import { ResourceManagerEvents } from '@shared/utils/resource-manager/resource-manager';

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
  selector: 'x-text',
  imports: [CommonModule, SearchHighlightDirective, LocaleSensitiveDirective],
  templateUrl: './text.component.html',
  styleUrl: './text.component.scss',
})
export class TextComponent implements OnDestroy {
  readonlyText = viewChild<ElementRef<HTMLSpanElement>>('readonlyText');

  editing = input<boolean>(false);

  text = input<string>();

  classes = input<{ [className: string]: boolean; }>();

  singleline = input<boolean>(false);

  time = input<string | undefined>();

  searchSubstringClass = input<string>(DEFAULT_SEARCH_SUBSTRING_CLASS);

  searchPattern = input<Array<string>>();

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

  private _$resourceUrls = new BehaviorSubject<Array<string>>([]);
  readonly $resourceUrls = this._$resourceUrls.asObservable();

  private _$resourceLoaded = new BehaviorSubject<string>('');
  readonly $resourceLoaded = this._$resourceLoaded.asObservable();

  private _onResourceLoadedHandler = (url: string) => {
    this._$resourceLoaded.next(url);
  };

  constructor() {
    resourceManager.addEventListener(ResourceManagerEvents.PROGRESS, this._onResourceLoadedHandler);

    this.theme = toSignal(this._themeService.$theme);

    this.readonlyStyles = computed(() => {
      const val = NONE;
      return { [USER_SELECT]: val, [WEBKIT_USER_SELECT]: val, [MOZ_USER_SELECT]: val };
    });

    effect(() => {
      const theme = this.theme();
      if (!!theme) {
        const preset = this._themeService.getPreset(theme.newsFeed.posts.post.content);
        if (!!preset) {
          this.searchSubstringBackground.set(preset.searchSubstringColor);
        }
      }
    });

    effect(() => {
      const theme = this.theme();
      if (!!theme) {
        const preset = this._themeService.getPreset(theme.newsFeed.posts.post.content);
        if (!!preset) {
          this.messageStatusColor.set(preset.statusColor);
        }
      }
    });

    effect(() => {
      const classes = this.classes(), currentTheme = this.theme();
      if (!!classes) {
        const preset = (this._themeService.getPreset(currentTheme?.newsFeed?.posts?.post)?.content);
        if (!!preset) {
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
      const theme = this.theme();
      if (!!theme) {
        const preset = this._themeService.getPreset(theme.newsFeed.posts.post.content.textEditor.comment);
        if (!!preset) {
          this.commentColor.set(preset.color);
          this.commentBackground.set(preset.background);
        }
      }
    });

    effect(() => {
      const theme = this.theme();
      if (!!theme) {
        const preset = this._themeService.getPreset(theme.newsFeed.posts.post.content.textEditor.link);
        if (!!preset) {
          this.linkNormalColor.set(preset.normal.color);
          this.linkVisitedColor.set(preset.visited.color);
          this.linkHoverColor.set(preset.hover.color);
          this.linkActiveColor.set(preset.active);
        }
      }
    });

    const $text = toObservable(this.text),
      $time = toObservable(this.time),
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

    combineLatest([$text, $time, $resources]).pipe(
      takeUntilDestroyed(),
      distinctUntilChanged(),
      switchMap(([text, time, resources]) => {
        return of({
          value: formatText(text, time, {
            selectable: false,
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

  ngOnDestroy(): void {
    if (!!this._$resourceUrls) {
      this._$resourceUrls.complete();
    }
    if (this._$resourceLoaded) {
      this._$resourceLoaded.complete();
    }

    resourceManager.removeEventListener(ResourceManagerEvents.PROGRESS, this._onResourceLoadedHandler);
  }
}
