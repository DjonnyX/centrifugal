import { Component, DestroyRef, effect, ElementRef, inject, input, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, delay, filter, map, switchMap, tap } from 'rxjs';
import { Color, GradientColor, GradientColorPositions } from '@shared/types';
import { MessageSubstarateStyle } from './types';
import { MessageSubstarateStyles } from './enums';

const DEFAULT_STROKE_ANIMATION_DURATION = 1000,
  LEFT_WIDTH = 17.5,
  RIGHT_WIDTH = 13,
  TOP_HEIGHT = 13,
  BOTTOM_HEIGHT = 13,
  DEFAULT_STROKE_WIDTH = 3,
  RIPPLE_ANIMATE_CLASS = 'animate',
  DEFAULT_RIPPLE_COLOR = 'rgba(0,0,0,0.1)',
  SHAPE_NAME = 'x-message-substrate-shape',
  CLIP_NAME = 'x-message-substrate-clip',
  GRADIENT_COLOR_NAME = 'stop-color',
  FILL_GRADIENT_NAME = 'x-message-substrate-fill-gradient',
  STROKE_GRADIENT_NAME = 'x-message-substrate-stroke-gradient',
  FILL = 'fill',
  INHERIT = 'inherit',
  X1 = 'x1',
  X2 = 'x2',
  STROKE_WIDTH = 'stroke-width',
  ID = 'id',
  HREF = 'href',
  CLIP_PATH = 'clip-path',
  VIEW_BOX = 'viewBox',
  D = 'd',
  STROKE = 'stroke',
  NONE = 'none',
  CX = 'cx',
  CY = 'cy',
  R = 'r',
  PX = 'px';

const rectPath = (width: number, height: number) => {
  const d = `M 0 0 h ${width} v ${height} h ${-width} z`;
  return d;
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-post-substrate',
  imports: [CommonModule],
  templateUrl: './post-substrate.component.html',
  styleUrl: './post-substrate.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class PostSubstrateComponent {
  private static __id: number = 0;
  private static get nextId() {
    const id = PostSubstrateComponent.__id = PostSubstrateComponent.__id + 1 === Number.MAX_SAFE_INTEGER ? 0 : PostSubstrateComponent.__id + 1;
    return id;
  }

  private _id: number;

  get id() { return this._id; }

  svg = viewChild<ElementRef<SVGElement>>('svg');

  rippleShape = viewChild<ElementRef<SVGCircleElement>>('ripple');

  clip = viewChild<ElementRef<SVGClipPathElement>>('clip');

  clipUse = viewChild<ElementRef<SVGUseElement>>('clipUse');

  shape = viewChild<ElementRef<SVGUseElement>>('shape');

  hilight = viewChild<ElementRef<SVGUseElement>>('hilight');

  path = viewChild<ElementRef<SVGPathElement>>('path');

  fillGradient = viewChild<ElementRef<SVGPathElement>>('fillGradient');

  strokeGradient = viewChild<ElementRef<SVGPathElement>>('strokeGradient');

  fillGradientColor1 = viewChild<ElementRef<SVGStopElement>>('fillGradientColor1');

  fillGradientColor2 = viewChild<ElementRef<SVGStopElement>>('fillGradientColor2');

  strokeGradientColor1 = viewChild<ElementRef<SVGStopElement>>('strokeGradientColor1');

  strokeGradientColor2 = viewChild<ElementRef<SVGStopElement>>('strokeGradientColor2');

  strokeAnimation = viewChild<ElementRef<SVGAnimateTransformElement>>('strokeAnimation');

  width = input.required<number>();

  height = input.required<number>();

  type = input<MessageSubstarateStyle>(MessageSubstarateStyles.NONE);

  strokeColors = input<GradientColor>();

  strokeWidth = input<number>(DEFAULT_STROKE_WIDTH);

  rippleColor = input<Color | undefined>(DEFAULT_RIPPLE_COLOR);

  fillColors = input<GradientColor | undefined>(undefined);

  fillPositions = input<GradientColorPositions | undefined>(undefined);

  strokeAnimationDuration = input<number>(DEFAULT_STROKE_ANIMATION_DURATION);

  rippleEnabled = signal<boolean>(false);

  prepared = signal<boolean>(false);

  classes = signal<{ [cName: string]: boolean }>({});

  private _destroyRef = inject(DestroyRef);

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  constructor() {
    this._id = PostSubstrateComponent.nextId;

    const $prepared = toObservable(this.prepared);

    $prepared.pipe(
      takeUntilDestroyed(),
      debounceTime(50),
      takeUntilDestroyed(this._destroyRef),
      tap((prepared) => {
        this.classes.set({ prepared });
      }),
    ).subscribe();

    effect(() => {
      const fillColors = this.fillColors();
      if (Array.isArray(fillColors) && fillColors.length === 2) {
        this.prepared.set(true);
        const fillGradientColor1 = this.fillGradientColor1(), fillGradientColor2 = this.fillGradientColor2();
        if (fillGradientColor1 && fillGradientColor2) {
          fillGradientColor1.nativeElement.setAttribute(GRADIENT_COLOR_NAME, `${fillColors[0]}`);
          fillGradientColor2.nativeElement.setAttribute(GRADIENT_COLOR_NAME, `${fillColors[1]}`);

          const shape = this.shape()?.nativeElement;
          if (shape) {
            shape.setAttribute(FILL, `url(#${FILL_GRADIENT_NAME}${this._id})`);
          }
        }
      } else {
        const shape = this.shape()?.nativeElement;
        if (shape) {
          shape.setAttribute(FILL, INHERIT);
        }
        this.prepared.set(false);
      }
    });

    effect(() => {
      const fillPositions = this.fillPositions();
      if (Array.isArray(fillPositions) && fillPositions.length === 2) {
        const fillGradient = this.fillGradient();
        if (fillGradient) {
          fillGradient.nativeElement.setAttribute(X1, `${Number.isNaN(fillPositions[0]) ? 0 : fillPositions[0]}px`);
          fillGradient.nativeElement.setAttribute(X2, `${Number.isNaN(fillPositions[1]) ? 0 : fillPositions[1]}px`);
        }
      }
    });

    effect(() => {
      const strokeColors = this.strokeColors();
      if (Array.isArray(strokeColors) && strokeColors.length === 2) {
        const strokeGradientColor1 = this.strokeGradientColor1(), strokeGradientColor2 = this.strokeGradientColor2();
        if (strokeGradientColor1 && strokeGradientColor2) {
          strokeGradientColor1.nativeElement.setAttribute(GRADIENT_COLOR_NAME, `${strokeColors[0]}`);
          strokeGradientColor2.nativeElement.setAttribute(GRADIENT_COLOR_NAME, `${strokeColors[1]}`);
        }
      }
    });

    effect(() => {
      const strokeWidth = this.strokeWidth(), shape = this.shape()?.nativeElement;
      if (shape) {
        shape.setAttribute(STROKE_WIDTH, `${strokeWidth}`);
      }
    });

    effect(() => {
      const strokeWidth = this.strokeWidth(), path = this.path()?.nativeElement;
      if (path) {
        path.setAttribute(STROKE_WIDTH, `${strokeWidth * 2}`);
      }
    });

    effect(() => {
      const strokeWidth = this.strokeWidth(), hilight = this.hilight()?.nativeElement;
      if (hilight) {
        hilight.setAttribute(STROKE_WIDTH, `${strokeWidth * 2}`);
      }
    });

    effect(() => {
      const fillGradient = this.fillGradient();
      if (fillGradient) {
        fillGradient.nativeElement.setAttribute(ID, `${FILL_GRADIENT_NAME}${this._id}`);
      }
    });

    effect(() => {
      const strokeGradient = this.strokeGradient();
      if (strokeGradient) {
        strokeGradient.nativeElement.setAttribute(ID, `${STROKE_GRADIENT_NAME}${this._id}`);
      }
    });

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
      const hilight = this.hilight();
      if (hilight) {
        hilight.nativeElement.setAttribute(CLIP_PATH, `url(#${CLIP_NAME}${this._id})`);
        hilight.nativeElement.setAttribute(HREF, `#${SHAPE_NAME}${this._id}`);
      }
    });

    effect(() => {
      const rippleShape = this.rippleShape();
      if (rippleShape) {
        rippleShape.nativeElement.setAttribute(CLIP_PATH, `url(#${CLIP_NAME}${this._id})`);
      }
    });

    effect(() => {
      const strokeAnimationDuration = this.strokeAnimationDuration(), strokeAnimation = this.strokeAnimation()?.nativeElement;
      if (strokeAnimation) {
        strokeAnimation.setAttribute('dur', `${strokeAnimationDuration ?? DEFAULT_STROKE_ANIMATION_DURATION}ms`);
      }
    });

    effect(() => {
      const svg = this.svg()?.nativeElement, path = this.path()?.nativeElement,
        ww = (this.width() ?? 0), w = ww > 0 ? ww : 0,
        hh = (this.height() ?? 0), h = hh > 0 ? hh : 0;
      if (svg && path) {
        svg.style.width = `${ww}${PX}`;
        svg.style.height = `${hh}${PX}`;
        svg.setAttribute(VIEW_BOX, `0 0 ${ww} ${hh}`);
        const shape = rectPath(w, h);
        path.setAttribute(D, shape);
      }
    });

    effect(() => {
      const type = this.type(), shape = this.shape()?.nativeElement;
      if (shape) {
        switch (type) {
          case MessageSubstarateStyles.STROKE: {
            shape.setAttribute(STROKE, `url(#${STROKE_GRADIENT_NAME}${this._id})`);
            break;
          }
          case MessageSubstarateStyles.NONE:
          default:
            shape.setAttribute(STROKE, NONE);
            break;
        }
      }
    });

    effect(() => {
      const type = this.type(), hilight = this.hilight()?.nativeElement;
      if (hilight) {
        switch (type) {
          case MessageSubstarateStyles.STROKE: {
            hilight.setAttribute(STROKE, `url(#${STROKE_GRADIENT_NAME}${this._id})`);
            break;
          }
          case MessageSubstarateStyles.NONE:
          default:
            hilight.setAttribute(STROKE, NONE);
            break;
        }
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
          delay(800),
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            rippleShape.classList.remove(RIPPLE_ANIMATE_CLASS);
            this.rippleEnabled.set(false);
          }),
        );
      }),
    ).subscribe();
  }

  ripple(e: PointerEvent) {
    const { x, y, width, height } = (this._elementRef.nativeElement as HTMLDivElement).getBoundingClientRect(),
      localX = e.clientX - x, localY = e.clientY - y, rippleColor = this.rippleColor() ?? DEFAULT_RIPPLE_COLOR, endRadius = Math.max(width, height);
    const rippleShape = this.rippleShape()?.nativeElement;
    if (rippleShape) {
      rippleShape.setAttribute(CX, String(localX));
      rippleShape.setAttribute(CY, String(localY));
      rippleShape.setAttribute(R, String(endRadius));
      rippleShape.setAttribute(FILL, rippleColor);
    }
    this.rippleEnabled.set(true);
  }
}
