import { Component, DestroyRef, effect, ElementRef, inject, input, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, delay, filter, map, switchMap, tap } from 'rxjs';
import { Color, GradientColor, GradientColorPositions } from '@shared/types';
import { MessageSubstarateMode } from './types/message-substrate-mode';
import { MessageSubstarateModes } from './enums/message-substrate-modes';
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

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-message-substrate',
  imports: [CommonModule],
  templateUrl: './message-substrate.component.html',
  styleUrl: './message-substrate.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class MessageSubstrateComponent {
  private static __id: number = 0;
  private static get nextId() {
    const id = MessageSubstrateComponent.__id = MessageSubstrateComponent.__id + 1 === Number.MAX_SAFE_INTEGER ? 0 : MessageSubstrateComponent.__id + 1;
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

  mode = input.required<MessageSubstarateMode>();

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
    this._id = MessageSubstrateComponent.nextId;

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
        ww = (this.width() ?? 0), w = ww > 0 ? ww - (LEFT_WIDTH + RIGHT_WIDTH + 10) : 0,
        hh = (this.height() ?? 0), h = hh > 0 ? hh - (TOP_HEIGHT + BOTTOM_HEIGHT + 10) : 0;
      if (svg && path) {
        svg.style.width = `${ww}${PX}`;
        svg.style.height = `${hh}${PX}`;
        svg.setAttribute(VIEW_BOX, `0 0 ${ww} ${hh}`);
        switch (this.mode()) {
          case MessageSubstarateModes.IN_LEFT: {
            const shape = `M 26.485 0 c -7.15 0 -12.954 5.835 -12.954 13.022 l 0 ${h} c 0 6.304 -1.651 11.287 -6.382 15.423 c -1.498 1.309 -3.686 2.575 -5.992 3.7 c -0.908 0.535 -1.349 1.614 -1.077 2.637 c 0.272 1.022 1.19 1.735 2.243 1.742 c 7.244 0.079 16.514 0.131 24.162 0.131 l ${w} 0 c 7.15 0 12.954 -5.835 12.954 -10.022 l 0 ${-(h + 13.956)} c 0 -7.187 -5.804 -13.022 -12.954 -13.022 Z`;
            path.setAttribute(D, shape);
            break;
          }
          case MessageSubstarateModes.IN_RIGHT: {
            const shape = `M${9 + w},0l4.516,0c7.15,0 12.954,5.835 12.954,13.022c-0,0 -0,-2.958 -0,${h}c-0,6.304 1.651,11.287 6.382,15.423c1.498,1.309 3.686,2.575 5.992,3.7c0.908,0.535 1.349,1.614 1.077,2.637c-0.272,1.022 -1.19,1.735 -2.243,1.742c-7.244,0.079 -16.514,0.131 ${-(w + 19.162)},0.131l-4.561,0c-7.15,0 -12.954,-5.835 -12.954,-13.022l0,${-(h + 10.8)}c0,-7.187 5.85,-13.022 12.999,-13.022Z`;
            path.setAttribute(D, shape);
            break;
          }
          case MessageSubstarateModes.LEFT:
          case MessageSubstarateModes.RIGHT:
          default: {
            const shape = `M ${44.043 + w - 5} 13.2 c 0 -7.285 -5.913 -13.2 -13.196 -13.2 L 13.239 0 c -7.283 0 -13.196 5.915 -13.196 13.2 L 0.043 ${h + 23} c 0 7.285 5.913 13.2 13.196 13.2 l ${17.608 + w - 5} 0 c 7.283 0 13.196 -5.915 13.196 -13.2 Z`;
            path.setAttribute(D, shape);
            break;
          }
        }
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
