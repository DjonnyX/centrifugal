import { Component, DestroyRef, effect, ElementRef, inject, input, output, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { delay, filter, map, switchMap, tap } from 'rxjs';
import {
  CLIP_NAME, CLIP_PATH, CX, CY, D, DEFAULT_RIPPLE_COLOR, DEFAULT_RIPPLE_DURATION, FILL, HREF, ID, R, RIPPLE_ANIMATE_CLASS, SHAPE_NAME, VIEW_BOX,
} from './const';
import { Color, ISize } from '../common';
import { PX } from '../common/const/base-prop-names';
import { getClientPoint, roundedRectPath } from './utils';
import { NtService } from '../common/services/nt.service';

/**
 * NtTouchableHighlightComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/touchable-highlight/nt-touchable-highlight.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
  selector: 'nt-touchable-highlight',
  templateUrl: './nt-touchable-highlight.component.html',
  styleUrl: './nt-touchable-highlight.component.scss',
  host: {
    style: `position: relative; width: 100%; height: 100%;`,
  },
  standalone: false,
  encapsulation: ViewEncapsulation.Emulated,
})
export class NtTouchableHighlightComponent {
  /**
   * Triggers on click.
   */
  readonly onClick = output<PointerEvent | TouchEvent>();

  /**
   * Ripple effect color.
   */
  readonly color = input<Color | null>(DEFAULT_RIPPLE_COLOR);

  /**
   * Ripple effect duration.
   */
  readonly duration = input<number>(DEFAULT_RIPPLE_DURATION);

  private static __id: number = 0;
  private static get nextId() {
    const id = NtTouchableHighlightComponent.__id = NtTouchableHighlightComponent.__id + 1 === Number.MAX_SAFE_INTEGER ? 0 : NtTouchableHighlightComponent.__id + 1;
    return id;
  }

  private _id: number;

  get id() { return this._id; }

  protected readonly svg = viewChild<ElementRef<SVGElement>>('svg');

  protected readonly rippleShape = viewChild<ElementRef<SVGCircleElement>>('ntRipple');

  protected readonly clip = viewChild<ElementRef<SVGClipPathElement>>('clip');

  protected readonly clipUse = viewChild<ElementRef<SVGUseElement>>('clipUse');

  protected readonly shape = viewChild<ElementRef<SVGUseElement>>('shape');

  protected readonly path = viewChild<ElementRef<SVGPathElement>>('path');

  private _elementRef = inject<ElementRef<HTMLDivElement>>(ElementRef);

  protected _bounds = signal<ISize>({ width: this._elementRef.nativeElement.offsetWidth, height: this._elementRef.nativeElement.offsetHeight });
  get bounds() { return this._bounds(); }

  protected readonly rippleEnabled = signal<boolean>(false);

  private _destroyRef = inject(DestroyRef);

  protected _ntService = inject(NtService);

  protected $tick = this._ntService.$tick;

  constructor() {
    this._id = NtTouchableHighlightComponent.nextId;

    const $tick = this.$tick;
    $tick.pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.onResizeViewport();
      }),
    ).subscribe();

    effect(() => {
      const path = this.path();
      if (path) {
        path.nativeElement.setAttribute(ID, `${SHAPE_NAME}${this._id}`);
      }
    });

    effect(() => {
      const clip = this.clip();
      if (clip) {
        clip.nativeElement.setAttribute(ID, `${CLIP_NAME}${this._id}`);
      }
    });

    effect(() => {
      const clipUse = this.clipUse();
      if (clipUse) {
        clipUse.nativeElement.setAttribute(HREF, `#${SHAPE_NAME}${this._id}`);
      }
    });

    effect(() => {
      const shape = this.shape();
      if (shape) {
        shape.nativeElement.setAttribute(CLIP_PATH, `url(#${CLIP_NAME}${this._id})`);
        shape.nativeElement.setAttribute(HREF, `#${SHAPE_NAME}${this._id}`);
      }
    });

    effect(() => {
      const rippleShape = this.rippleShape();
      if (rippleShape) {
        rippleShape.nativeElement.setAttribute(CLIP_PATH, `url(#${CLIP_NAME}${this._id})`);
      }
    });

    effect(() => {
      const svg = this.svg()?.nativeElement, path = this.path()?.nativeElement, minSize = 0,
        { width, height } = this._bounds();
      if (svg && path) {
        svg.style.width = `${width}${PX}`;
        svg.style.height = `${height}${PX}`;
        svg.setAttribute(VIEW_BOX, `0 0 ${width} ${height}`);
        const shape = roundedRectPath(width, height, 0, 0, 0, 0);
        path.setAttribute(D, shape);
      }
    });

    const $rippleShape = toObservable(this.rippleShape),
      $rippleEnabled = toObservable(this.rippleEnabled);

    $rippleShape.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
      switchMap(rippleShape => {
        return $rippleEnabled.pipe(
          takeUntilDestroyed(this._destroyRef),
          filter(v => !!v),
          tap(() => {
            if (rippleShape) {
              rippleShape.classList.add(RIPPLE_ANIMATE_CLASS);
            }
          }),
          delay(this.duration()),
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            rippleShape.classList.remove(RIPPLE_ANIMATE_CLASS);
            this.rippleEnabled.set(false);
          }),
        );
      }),
    ).subscribe();
  }

  ripple(e: PointerEvent | TouchEvent) {
    const { x, y, width, height } = (this._elementRef.nativeElement as HTMLDivElement).getBoundingClientRect(),
      point = getClientPoint(e);
    if (!point) {
      return;
    }
    const localX = point.x - x,
      localY = point.y - y,
      color = this.color() ?? DEFAULT_RIPPLE_COLOR,
      endRadius = Math.max(width, height),
      rippleShape = this.rippleShape()?.nativeElement;
    if (!!rippleShape) {
      rippleShape.setAttribute(CX, String(localX));
      rippleShape.setAttribute(CY, String(localY));
      rippleShape.setAttribute(R, String(endRadius));
      rippleShape.setAttribute(FILL, color);
    }
    this.rippleEnabled.set(true);

    this.onClick.emit(e);
  }

  protected onResizeViewport() {
    const viewport = this._elementRef.nativeElement;
    if (!!viewport) {
      const bounds: ISize = { width: viewport.offsetWidth, height: viewport.offsetHeight }, b = this._bounds();
      if (bounds.width === b.width && bounds.height === b.height) {
        return;
      }
      this._bounds.set(bounds);
    }
  }
}
