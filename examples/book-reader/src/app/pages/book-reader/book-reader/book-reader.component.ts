import { CommonModule } from '@angular/common';
import {
  Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, inject, OnDestroy, Signal, signal, viewChild, ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, filter, map, tap, } from 'rxjs';
import { TextSearchComponent } from '@entities/header';
import { ISize } from 'centrifugal';
import { ClickOutsideService } from '@shared/directives';
import { ReaderComponent } from "@widgets/reader/reader/reader.component";
import { ITheme } from '@shared/theming';
import { ThemeService } from '@shared/theming';
import { generateChatCollection } from '@mock/const';
import { LocaleSensitiveDirective } from '@shared/localization';
import { ReaderService } from '@widgets/reader/reader.service';
import { ReaderMockService } from '@widgets/reader/reader-mock.service';
import { ReaderHttpService } from '@widgets/reader/reader-http.service';
import { environment } from '@environments/environment';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-book-reader',
  standalone: true,
  imports: [CommonModule, FormsModule, LocaleSensitiveDirective, TextSearchComponent, ReaderComponent],
  templateUrl: './book-reader.component.html',
  styleUrl: './book-reader.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ClickOutsideService,
    { provide: ReaderService, useClass: environment.useMock ? ReaderMockService : ReaderHttpService },
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class BookReader implements OnDestroy {
  protected _toolbar = viewChild<ElementRef<HTMLDivElement>>('toolbar');

  protected _header = viewChild<ElementRef<HTMLDivElement>>('header');

  private _$version = new BehaviorSubject<number>(0);
  readonly $version = this._$version.asObservable();

  theme: Signal<ITheme | undefined>;

  show = signal(true);

  search = signal('');

  items = generateChatCollection();

  title = signal<string | undefined>('Book Reader');

  private _themeService = inject(ThemeService);

  private _toolbarResizeObserver: ResizeObserver;

  toolbarBounds = signal<ISize>({
    width: this._toolbar()?.nativeElement?.offsetWidth || 0,
    height: this._toolbar()?.nativeElement?.offsetHeight || 0,
  });

  private _onToolbarResizeHandler = () => {
    const el = this._toolbar()?.nativeElement as HTMLDivElement;
    if (el && el.offsetWidth && el.offsetHeight) {
      this.toolbarBounds.set({ width: el.offsetWidth || 0, height: el.offsetHeight || 0 });
    }
  }

  constructor() {
    this._toolbarResizeObserver = new ResizeObserver(this._onToolbarResizeHandler);

    const $toolbar = toObservable(this._toolbar).pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
    );

    $toolbar.pipe(
      takeUntilDestroyed(),
      tap(toolbar => {
        this._toolbarResizeObserver.observe(toolbar);
      }),
    ).subscribe();

    this.theme = toSignal(this._themeService.$theme);

    effect(() => {
      const theme = this.theme(), toolbar = this._toolbar()?.nativeElement;
      if (theme && toolbar) {
        const preset = this._themeService.getPreset(theme.bookReader.header);
        if (preset) {
          toolbar.style.background = preset.background;
        }
      }
    });

    effect(() => {
      const theme = this.theme(), header = this._header()?.nativeElement;
      if (theme && header) {
        const preset = this._themeService.getPreset(theme.bookReader.header);
        if (preset) {
          header.style.color = preset.color;
          header.style.fontSize = preset.fontSize;
        }
      }
    });
  }

  onSearchHandler(pattern: any) {
    this.search.set(pattern);
  }

  ngOnDestroy(): void {
    if (this._toolbarResizeObserver) {
      this._toolbarResizeObserver.disconnect();
    }
  }
}
