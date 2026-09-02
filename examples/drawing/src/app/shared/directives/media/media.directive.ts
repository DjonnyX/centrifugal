import { Directive, effect, ElementRef, inject, input, Signal } from '@angular/core';
import { IMediaParams } from './interfaces';
import { MediaService } from './media.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ISize } from 'ng-virtual-list';
import { MediaScreenSize } from './types';
import { getMediaSize } from './utils';

const AUTO = 'auto',
  PX = 'px';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Directive({
  selector: '[media]'
})
export class MediaDirective {
  mediaSize = input<IMediaParams>({});

  private _bounds: Signal<ISize | undefined>;

  private _size: Signal<MediaScreenSize | undefined>;

  private _service = inject(MediaService);

  private _elementRef = inject(ElementRef<HTMLElement>);

  constructor() {
    this._bounds = toSignal(this._service.$bounds);
    this._size = toSignal(this._service.$size);

    effect(() => {
      const mediaSize = this.mediaSize(), size = this._size(), bounds = this._bounds(), element = this._elementRef.nativeElement as HTMLElement;
      if (element && size && mediaSize && bounds) {
        const s = getMediaSize(mediaSize, bounds, size);
        if (s === undefined) {
          element.style.width = AUTO;
        } else {
          const sn = Number(s);
          if (!Number.isNaN(sn)) {
            element.style.width = `${sn}${PX}`;
          } else {
            element.style.width = AUTO;
          }
        }
      }
    });
  }
}
