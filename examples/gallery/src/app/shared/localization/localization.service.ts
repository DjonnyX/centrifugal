import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ILocalization } from './localizations/interfaces/localization';
import { getTextDirectionByLocale, LocaleList, Localizations } from './localizations';
import { TextDirections } from './localizations/enums';

const DEFAULT_LOCALE: string = 'en-US';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private _$locale = new BehaviorSubject<string>(DEFAULT_LOCALE);
  readonly $locale = this._$locale.asObservable();

  private _textDirection: TextDirections = getTextDirectionByLocale(this._$locale.getValue());
  get textDirection() { return this._textDirection; }

  private _$localization = new BehaviorSubject<ILocalization>(Localizations[DEFAULT_LOCALE.toString()]);
  readonly $localization = this._$localization.asObservable();
  get localization() { return this._$localization.getValue(); }

  change(locale: string) {
    const actualLocale = LocaleList.includes(locale) ? locale : DEFAULT_LOCALE,
      localization = Localizations[actualLocale],
      textDirection = getTextDirectionByLocale(locale);
    this._textDirection = textDirection;
    this._$localization.next(localization);
    this._$locale.next(actualLocale);
  }
}
