import { Directive, Renderer2, ElementRef, input, inject, SecurityContext, effect, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NON_SEARCHABLE_PATTERN } from '@shared/utils/text/format-text.util';

const INNER_HTML = 'innerHTML', NOT_SELECTABLE_SERVICE_PATTERN = 'ή';

const NUMBERS = ['ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'ι', 'κ'],
    getId = (num: number) => {
        const src = String(num);
        let result = '';
        for (let i = 0, l = src.length; i < l; i++) {
            const n = Number(src.charAt(i));
            result += NUMBERS[n];
        }
        return result;
    },
    getServiceId = (num: number) => {
        return `${NOT_SELECTABLE_SERVICE_PATTERN}${getId(num)}`;
    };

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Directive({
    selector: '[searchHighlight]'
})
export class SearchHighlightDirective implements OnDestroy {
    searchedWords = input<Array<string>>();

    private _previousValue: string | undefined;

    text = input<string | undefined>();

    simpleText = input<string | undefined>();

    substringClass = input<string>('search-substring');

    private _elementRef = inject(ElementRef);

    private _renderer = inject(Renderer2);

    private _sanitizer = inject(DomSanitizer);

    constructor() {
        effect(() => {
            const text = this.text() ?? '', s = this.searchedWords(), substringClass = this.substringClass();
            if (!s || !s.length || !substringClass) {
                const value = text;
                if (this._previousValue === value) {
                    return;
                }

                this._previousValue = value;
                const sanitized = this._sanitizer.sanitize(SecurityContext.HTML, this._sanitizer.bypassSecurityTrustHtml(value));
                this._renderer.setProperty(this._elementRef.nativeElement, INNER_HTML, sanitized);
                return;
            }

            const value = this.getFormattedText(text, s, substringClass);
            if (this._previousValue === value) {
                return;
            }
            this._previousValue = value;
            const sanitized = this._sanitizer.sanitize(SecurityContext.HTML, this._sanitizer.bypassSecurityTrustHtml(value));
            this._renderer.setProperty(
                this._elementRef.nativeElement,
                INNER_HTML,
                sanitized,
            );
        });
    }

    getFormattedText(text: string, searchWords: Array<string> | undefined, substringClass: string) {
        const s = searchWords, t = text ?? '';
        if (!s || (s.length === 1 && (s[0] === ''))) {
            return t;
        }
        let result = t ?? '';
        const regexp = new RegExp(`(${s.join('|')})`, 'g'), notSelectable = result?.match(NON_SEARCHABLE_PATTERN),
            notSelectableList = new Array<string>();
        if (!!notSelectable) {
            for (let i = 0, l = notSelectable.length; i < l; i++) {
                const section = notSelectable[i];
                if (!!section) {
                    notSelectableList.push(section);
                    result = result.replace(section, getServiceId(i));
                }
            }
        }
        result = result.replace(regexp, `<span class="${substringClass}">$1</span>`);
        for (let i = 0, l = notSelectableList.length; i < l; i++) {
            const section = notSelectableList[i];
            if (!!section) {
                result = result.replace(getServiceId(i), section);
            }
        }
        return result;
    }

    ngOnDestroy(): void {
        this._previousValue = undefined;
    }
}
