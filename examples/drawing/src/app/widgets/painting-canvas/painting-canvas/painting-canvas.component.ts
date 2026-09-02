import { Component, computed, DestroyRef, ElementRef, inject, OnDestroy, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomScrollbarModule } from '../../../components/custom-scrollbar/custom-scrollbar.module';
import { GradientColor, RoundedCorner } from '../../../types';
import { CustomScrollBarTheme } from '../../../components/custom-scrollbar/interfaces/custom-scrollbar-theme';
import { BehaviorSubject, delay, filter, fromEvent, map, race, switchMap, takeUntil, tap } from 'rxjs';
import { DraftComponent } from './components/draft/draft.component';
import { ButtonDrawComponent } from './components/button-draw/button-draw.component';
import { ButtonDragComponent } from './components/button-drag/button-drag.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { INtScrollViewAnimationParams, Id, IScrollingSettings, ISize, NtScrollViewModule } from 'centrifugal';

const X_LITE_BLUE_PLASMA_GRADIENT: GradientColor = ["rgba(133, 142, 255, 0)", "rgb(0, 133, 160)"],
  ROUND_CORNER: RoundedCorner = [3, 3, 3, 3],
  CUSTOM_SCROLLBAR_THEME: CustomScrollBarTheme = {
    fill: ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.75)"],
    hoverFill: ["rgba(205, 205, 205, 1)", "rgba(205, 205, 205, 0.75)"],
    pressedFill: ["rgba(185, 185, 185, 1)", "rgba(185, 185, 185, 0.75)"],
    strokeGradientColor: X_LITE_BLUE_PLASMA_GRADIENT,
    strokeAnimationDuration: 1000,
    roundCorner: ROUND_CORNER,
    rippleColor: 'rgba(0,0,0,0.5)',
    rippleEnabled: true,
  };

const MAX_ITEMS = 1000;

const generateItems = (len: number = MAX_ITEMS) => {
  const result = [];
  for (let i = 0, l = len; i < l; i++) {
    const idX = i + 1;
    for (let j = 0, l1 = len; j < l1; j++) {
      const idY = j + 1;
      result.push([{ idX }, { idY }]);
    }
  }
  return result;
};

interface ILine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

@Component({
  selector: 'x-painting-canvas',
  imports: [
    CommonModule, FormsModule, NtScrollViewModule, CustomScrollbarModule, DraftComponent,
    ButtonDrawComponent, ButtonDragComponent,
  ],
  templateUrl: './painting-canvas.component.html',
  styleUrl: './painting-canvas.component.scss',
  standalone: true,
})
export class PaintingCanvasPageComponent implements OnDestroy {
  private _content = viewChild<ElementRef<HTMLDivElement>>('drawContainer');

  customScrollBarThumbParams = CUSTOM_SCROLLBAR_THEME;

  scrollingSettings: IScrollingSettings = {
    frictionalForce: 0.5,
    mass: 0.1,
    maxDistance: 1000,
    maxDuration: 10000,
    speedScale: 10,
    optimization: false,
  }

  animationParams: INtScrollViewAnimationParams = {
    scrollToItem: 0,
    snapToItem: 150,
  }

  items = generateItems(1000);

  motionBlurEnabled = false;

  private _$contentSize = new BehaviorSubject<number>(3000);
  protected $contentSize = this._$contentSize.asObservable();

  private _animationDir: 1 | -1 = -1;

  private _animationId: number | null = null;

  drawSelected = signal<boolean>(false);

  dragSelected = signal<boolean>(true);

  scrollable: Signal<boolean>;

  drawing = signal<boolean>(false);

  lines = signal<Array<ILine>>([]);

  private _destroyRef = inject(DestroyRef);

  constructor() {
    const bp: Promise<EventTarget & { level: number, charging: boolean; }> | null = (navigator as any).getBattery?.() ?? null;
    if (!!bp) {
      bp.then(battery => {
        battery.addEventListener('levelchange', () => {
          this.motionBlurEnabled = battery.level >= 0.10 || battery.charging;
        });
        this.motionBlurEnabled = battery.level >= 0.10 || battery.charging;
      });
    }

    this.scrollable = computed(() => {
      return this.dragSelected();
    });

    this.animateContentSize();

    const $content = toObservable(this._content).pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(v => !!v),
      map(v => v.nativeElement),
    ),
      $mouseUp = race([
        fromEvent<MouseEvent>(window, 'mouseup', { passive: true }).pipe(
          takeUntilDestroyed(this._destroyRef),
        ),
        $content.pipe(
          takeUntilDestroyed(this._destroyRef),
          switchMap(content => fromEvent<MouseEvent>(content, 'mouseup', { passive: true }))
        ),
      ]),
      $mouseDragCancel = $mouseUp.pipe(
        takeUntilDestroyed(this._destroyRef),
        delay(0),
        tap(() => {
          this.drawing.set(false);
        }),
      );

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      switchMap(content => {
        return fromEvent<MouseEvent>(content, 'mousedown', { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          switchMap(e => {
            return race([fromEvent<MouseEvent>(window, 'mouseup', { passive: false }), fromEvent<MouseEvent>(content, 'mouseup', { passive: false })]).pipe(
              takeUntilDestroyed(this._destroyRef),
              takeUntil(fromEvent<MouseEvent>(window, 'mousemove', { passive: false })),
              tap(e => {
                this.drawing.set(false);
              }),
            );
          }),
        );
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      switchMap(content => {
        return fromEvent<MouseEvent>(content, 'mousedown', { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          filter(() => !this.scrollable()),
          switchMap(e => {
            if (e.cancelable) {
              e.stopImmediatePropagation();
              e.preventDefault();
            }
            this.drawing.set(true);
            let prevClientPositionX: number | null = e.clientX,
              prevClientPositionY: number | null = e.clientY,
              { x: contentX, y: contentY } = this._content()?.nativeElement.getBoundingClientRect()!,
              startClientPosX = prevClientPositionX - contentX,
              startClientPosY = prevClientPositionY - contentY;
            const line: ILine = {
              x1: startClientPosX,
              x2: startClientPosX,
              y1: startClientPosY,
              y2: startClientPosY,
            };
            const l = [...this.lines(), line];
            this.lines.set(l);
            return fromEvent<MouseEvent>(window, 'mousemove', { passive: false }).pipe(
              takeUntilDestroyed(this._destroyRef),
              takeUntil($mouseDragCancel),
              switchMap(e => {
                const x = e.clientX - contentX, y = e.clientY - contentY;
                line.x2 = x;
                line.y2 = y;
                const l = [...this.lines()];
                this.lines.set(l);
                return race([fromEvent<MouseEvent>(window, 'mouseup', { passive: false }), fromEvent<MouseEvent>(content, 'mouseup', { passive: false })]).pipe(
                  takeUntilDestroyed(this._destroyRef),
                  takeUntil($mouseDragCancel),
                  tap(e => {
                    this.drawing.set(false);
                  }),
                );
              }),
            );
          })
        );
      }),
    ).subscribe();

    const $touchUp = race(
      [
        fromEvent<TouchEvent>(window, 'touchend', { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
        ),
        $content.pipe(
          takeUntilDestroyed(this._destroyRef),
          switchMap(content => fromEvent<TouchEvent>(content, 'touchend', { passive: false })),
        ),
      ]
    ),
      $touchDragCancel = $touchUp.pipe(
        takeUntilDestroyed(this._destroyRef),
        delay(0),
        tap(() => {
          this.drawing.set(false);
        }),
      );

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      switchMap(content => {
        return fromEvent<TouchEvent>(content, 'touchstart', { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          switchMap(e => {
            return race([fromEvent<TouchEvent>(window, 'touchend', { passive: false }), fromEvent<TouchEvent>(content, 'touchend', { passive: false })]).pipe(
              takeUntilDestroyed(this._destroyRef),
              takeUntil(fromEvent<TouchEvent>(window, 'touchmove', { passive: false })),
              tap(e => {
                this.drawing.set(false);
              }),
            );
          }),
        );
      }),
    ).subscribe();

    $content.pipe(
      takeUntilDestroyed(this._destroyRef),
      switchMap(content => {
        return fromEvent<TouchEvent>(content, 'touchstart', { passive: false }).pipe(
          takeUntilDestroyed(this._destroyRef),
          filter(() => !this.scrollable()),
          switchMap(e => {
            if (e.cancelable) {
              e.stopImmediatePropagation();
              e.preventDefault();
            }
            this.drawing.set(true);
            let prevClientPositionX: number | null = e.touches?.[e.touches?.length - 1]?.clientX,
              prevClientPositionY: number | null = e.touches?.[e.touches?.length - 1]?.clientY,
              { x: contentX, y: contentY } = this._content()?.nativeElement.getBoundingClientRect()!,
              startClientPosX = prevClientPositionX - contentX,
              startClientPosY = prevClientPositionY - contentY;
            const line: ILine = {
              x1: startClientPosX,
              x2: startClientPosX,
              y1: startClientPosY,
              y2: startClientPosY,
            };
            const l = [...this.lines(), line];
            this.lines.set(l);
            return fromEvent<TouchEvent>(window, 'touchmove', { passive: false }).pipe(
              takeUntilDestroyed(this._destroyRef),
              takeUntil($touchDragCancel),
              switchMap(e => {
                const x = e.touches?.[e.touches?.length - 1]?.clientX - contentX, y = e.touches?.[e.touches?.length - 1]?.clientY - contentY;
                line.x2 = x;
                line.y2 = y;
                const l = [...this.lines()];
                this.lines.set(l);
                return race([fromEvent<TouchEvent>(window, 'touchend', { passive: false }), fromEvent<TouchEvent>(content, 'touchend', { passive: false })]).pipe(
                  takeUntilDestroyed(this._destroyRef),
                  takeUntil($touchDragCancel),
                  tap(e => {
                    this.drawing.set(false);
                  }),
                );
              }),
            );
          })
        );
      }),
    ).subscribe();
  }

  private animateContentSize() {
    this._$contentSize.next(this._$contentSize.getValue() + this._animationDir * 5);
    if (this._$contentSize.getValue() === 800) {
      this._animationDir = 1;
    } else if (this._$contentSize.getValue() === 3000) {
      this._animationDir = -1;
    }

    this._animationId = requestAnimationFrame(() => {
      this.animateContentSize();
    });
  }

  onSelectHandler(data: Array<Id> | Id | null) {
    console.info(`Select: ${JSON.stringify(data)}`);
  }

  onViewportChangeHandler(size: ISize) {
    console.info(`Viewport changed: ${JSON.stringify(size)}`);
  }

  onScrollReachStartHandler() {
    console.info(`onScrollReachStart`);
  }

  onScrollReachEndHandler() {
    console.info(`onScrollReachEnd`);
  }

  onDrawClickHandler() {
    this.drawSelected.update(v => !v);
    this.dragSelected.set(!this.drawSelected());
  }

  onDragClickHandler() {
    this.dragSelected.update(v => !v);
    this.drawSelected.set(!this.dragSelected());
  }

  ngOnDestroy() {
    if (this._animationId !== null) {
      cancelAnimationFrame(this._animationId);
      this._animationId = null;
    }
  }
}
