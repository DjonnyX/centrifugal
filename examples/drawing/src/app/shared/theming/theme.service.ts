import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, distinctUntilChanged, filter, of, switchMap, tap } from 'rxjs';
import { ITheme } from './themes/interfaces/theme';
import { THEME_LIGHT } from './themes/light';
import { ThemeName, Themes } from './themes/themes';
import { PRESETS } from './themes/presets';

const IS_DARK_THEME_PATTERN = '(prefers-color-scheme: dark)',
  CHANGE_EVENT = 'change';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _$name = new BehaviorSubject<ThemeName>('auto');
  readonly $name = this._$name.asObservable();

  set name(v: string) {
    this._$name.next(v);
  }
  private _theme: ITheme = THEME_LIGHT;
  get theme(): ITheme { return this._theme; }

  private _$theme = new BehaviorSubject<ITheme>(THEME_LIGHT);
  readonly $theme = this._$theme.asObservable();

  constructor() {
    this.$theme.pipe(
      takeUntilDestroyed(),
      tap(theme => {
        this._theme = theme;
      }),
    ).subscribe();

    this._$name.pipe(
      takeUntilDestroyed(),
      distinctUntilChanged(),
      switchMap(name => {
        if (name === 'auto') {
          return of(this.setupThemeAutomatically(window.matchMedia(IS_DARK_THEME_PATTERN).matches));
        }
        const theme = Themes[name];
        return of({ emited: false, name, theme });
      }),
      filter(v => !!v),
      tap(({ theme, emited }) => {
        if (!emited && theme) {
          this._$theme.next(theme);
        }
      }),
    ).subscribe();

    const prefersDarkScheme = window.matchMedia(IS_DARK_THEME_PATTERN);

    prefersDarkScheme.addEventListener(CHANGE_EVENT, (event) => {
      this.setupThemeAutomatically(event.matches);
    });
  }

  private setupThemeAutomatically(isDark: boolean) {
    if (this._$name.getValue() === 'auto') {
      const name = isDark ? 'dark' : 'light', theme = Themes[name];
      this._$theme.next(theme);
      return { theme, name, emited: true };
    }
    return undefined;
  }

  getPreset<P = any>(themeObject: string | { [state: string]: any } | undefined): P | undefined {
    if (!themeObject) {
      return;
    }
    const value = themeObject;
    if (typeof value === 'string' && PRESETS.includes(value)) {
      return this._theme.presets[value];
    }
    return themeObject as P;
  }
}
