import { Component, ElementRef, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, tap } from 'rxjs';
import { MediaService } from '@shared/directives/media';
import { ThemeNames, ThemeService } from '@shared/theming';
import { ISize, NtControlContainerModule } from 'centrifugal';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NtControlContainerModule],
  providers: [ThemeService, MediaService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private _themeService = inject(ThemeService);

  private _mediaService = inject(MediaService);

  private _elementRef = inject(ElementRef);

  constructor() {
    const appResizeHandler = (bounds: ISize) => document.body.style.height = `${bounds.height}px`,
      winResizeHandler = () => appResizeHandler({ width: window.innerWidth, height: window.innerHeight });

    this._mediaService.$bounds.pipe(
      takeUntilDestroyed(),
      tap(bounds => {
        appResizeHandler(bounds);
      }),
    ).subscribe();

    window.addEventListener('resize', winResizeHandler);
    window.addEventListener('scroll', winResizeHandler);

    this._themeService.name = ThemeNames[0];

    const el = this._elementRef.nativeElement;
    fromEvent<KeyboardEvent>(el, 'keydown', { passive: false, capture: false }).pipe(
      takeUntilDestroyed(),
      tap(e => {
        if (e.ctrlKey && e.code == 'KeyA') {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      })
    ).subscribe();
  }
}
