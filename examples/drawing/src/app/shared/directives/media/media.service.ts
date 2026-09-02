import { inject, Injectable } from '@angular/core';
import { ISize } from 'ng-virtual-list';
import { BehaviorSubject, combineLatest, Subject, tap } from 'rxjs';
import { MEDIA_CONFIG } from './const';
import { MediaScreenSize } from './types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IMediaParams } from './interfaces';
import { getMediaSize } from './utils';

const bodySize = (): ISize => ({ width: window.innerWidth, height: window.innerHeight });

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
    providedIn: 'root'
})
export class MediaService {
    private _resizeObserver: ResizeObserver;

    private _onResizeHandler = () => {
        this._$bounds.next(bodySize());
    };

    private _$changes = new BehaviorSubject<{ size: MediaScreenSize | undefined, bounds: ISize }>({ size: undefined, bounds: bodySize() });
    readonly $changes = this._$changes.asObservable();

    private _$bounds = new BehaviorSubject<ISize>(bodySize());
    readonly $bounds = this._$bounds.asObservable();

    private _$size = new BehaviorSubject<MediaScreenSize | undefined>(undefined);
    readonly $size = this._$size.asObservable();

    private _config = inject(MEDIA_CONFIG);

    constructor() {
        this._resizeObserver = new ResizeObserver(this._onResizeHandler);
        this._resizeObserver.observe(document.body);

        this.$bounds.pipe(
            takeUntilDestroyed(),
            tap(({ width, height }) => {
                const config = this._config;
                if (config) {
                    let currentSize: number = Number.MAX_SAFE_INTEGER,
                        currentSizeKey: MediaScreenSize | undefined = undefined;
                    for (const sizeKey in config) {
                        const size = config[sizeKey];
                        if (width <= size && size < currentSize) {
                            currentSize = size;
                            currentSizeKey = sizeKey as MediaScreenSize;
                        }
                    }
                    this._$size.next(currentSizeKey);
                }
            }),
        ).subscribe();

        combineLatest([this.$bounds, this.$size]).pipe(
            takeUntilDestroyed(),
            tap(([bounds, size]) => {
                this._$changes.next({ bounds, size });
            }),
        ).subscribe();
    }

    getMediaSize(mediaSize: IMediaParams): string | number | undefined {
        const bounds = this._$bounds.getValue(), size = this._$size.getValue();
        if (size && mediaSize && bounds) {
            return getMediaSize(mediaSize, bounds, size);
        }
        return undefined;
    }
}
