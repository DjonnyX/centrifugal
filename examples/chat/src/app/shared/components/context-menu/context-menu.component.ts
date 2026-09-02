import { Component, effect, ElementRef, inject, input, OnDestroy, output, signal, Signal, ViewChild, viewChild } from '@angular/core';
import { CdkMenu } from '@angular/cdk/menu';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { delay, Subject, tap } from 'rxjs';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { ButtonPresets, ContextMenuPresets } from '@shared/theming/themes/presets';
import { GradientColor, GradientColorPositions, RoundedCorner } from '@shared/types';
import { IContextMenuCollection } from './interfaces/context-menu-collection.interface';
import { ButtonComponent } from '../button';
import { SubstarateMode, SubstarateModes, SubstarateStyle, SubstarateStyles } from '../substrate';
import { formatCSSNumber } from '../utils';
import { SubstrateModule } from '../substrate/substrate.module';
import { Id, ISize } from 'centrifugal';

const DEFAULT_CONTEXT_MENU_WIDTH = 20,
  DEFAULT_CONTEXT_MENU_HEIGHT = 20,
  DEFAULT_ROUNDED_CORNER: RoundedCorner = [10, 10, 10, 10],
  DEFAULT_FILL_POSITIONS: GradientColorPositions = [0, 1],
  DEFAULT_STROKE_ANIMATION_DURATION = 1000,
  UNSET = 'unset';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-context-menu',
  imports: [CdkMenu, SubstrateModule, ButtonComponent],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent implements OnDestroy {
  contextMenu = viewChild<ElementRef<HTMLDivElement>>('contextMenu');

  @ViewChild('contextMenu', { read: CdkMenu })
  cMenu: CdkMenu | undefined = undefined;

  content = viewChild<ElementRef<HTMLDivElement>>('content');

  mode = input<SubstarateMode>(SubstarateModes.ROUNDED_RECTANGLE);

  type = input<SubstarateStyle>(SubstarateStyles.STROKE);

  items = input.required<IContextMenuCollection>();

  onClick = output<{ id: Id, event: Event }>();

  preset = input<ContextMenuPresets | string | undefined>(undefined);

  buttonPreset = input<ButtonPresets | string | undefined>(undefined);

  theme: Signal<ITheme | undefined>;

  strokeColor = input<GradientColor | undefined>(undefined);

  roundCorner = signal<RoundedCorner>(DEFAULT_ROUNDED_CORNER);

  fillColors = input<GradientColor | undefined>(undefined);

  fillPositions = input<GradientColorPositions | undefined>(DEFAULT_FILL_POSITIONS);

  fillGradientColors = signal<GradientColor | undefined>(this.fillColors());

  fillGradientPositions = signal<GradientColorPositions | undefined>(this.fillPositions());

  strokeGradientColor = signal<GradientColor | undefined>(this.strokeColor());

  shapeRoundCorner = signal<[number, number, number, number] | undefined>(this.roundCorner());

  strokeAnimationDuration = signal<number>(DEFAULT_STROKE_ANIMATION_DURATION);

  contextMenuButtonPreset = signal<ButtonPresets | string | undefined>(this.buttonPreset());

  readonly bounds = signal<ISize>({ width: DEFAULT_CONTEXT_MENU_WIDTH, height: DEFAULT_CONTEXT_MENU_HEIGHT });

  private _$click = new Subject<{ event: Event, id: Id }>();
  protected $click = this._$click.asObservable();

  private _themeService = inject(ThemeService);

  private _resizeObserer: ResizeObserver | undefined;

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _onResizeHandler = () => {
    const el = this._elementRef.nativeElement as HTMLDivElement,
      { width, height } = el.getBoundingClientRect();
    this.bounds.set({ width, height });
  };

  constructor() {
    const el = this._elementRef.nativeElement as HTMLDivElement;
    this._resizeObserer = new ResizeObserver(this._onResizeHandler);
    this._resizeObserer.observe(el);

    const $click = this.$click;

    $click.pipe(
      takeUntilDestroyed(),
      delay(300),
      tap(e => {
        this.onClick.emit(e);
        this.cMenu?.menuStack?.closeAll();
      }),
    ).subscribe();

    this.theme = toSignal(this._themeService.$theme);

    effect(() => {
      this.applyTheme();
    });
  }

  protected applyTheme() {
    const theme = this.theme();
    if (theme) {
      const preset = this.preset();
      if (preset) {
        const themePreset = this._themeService.getPreset(preset);
        if (themePreset) {
          this.applyStyles(themePreset);
        }
      }
    }
  }

  private applyStyles(currentPreset?: string) {
    const preset = currentPreset ?? this.preset(), theme = this.theme(), fillColors = this.fillColors(), strokeColor = this.strokeColor(),
      roundCorner = this.roundCorner(), fillPositions = this.fillPositions(), buttonPreset = this.buttonPreset();
    if (theme && preset) {
      const themePreset = this._themeService.getPreset(preset);
      if (themePreset) {
        const ctxMenuElement = this.contextMenu()?.nativeElement as HTMLDivElement,
          contentElement = this.content()?.nativeElement as HTMLDivElement;
        if (contentElement && ctxMenuElement) {
          contentElement.style.padding = themePreset.padding ? themePreset.padding : UNSET;
          ctxMenuElement.style.borderTopLeftRadius = themePreset.roundedCorner ? formatCSSNumber(themePreset.roundedCorner[0]) : UNSET;
          ctxMenuElement.style.borderBottomLeftRadius = themePreset.roundedCorner ? formatCSSNumber(themePreset.roundedCorner[1]) : UNSET;
          ctxMenuElement.style.borderBottomRightRadius = themePreset.roundedCorner ? formatCSSNumber(themePreset.roundedCorner[2]) : UNSET;
          ctxMenuElement.style.borderTopRightRadius = themePreset.roundedCorner ? formatCSSNumber(themePreset.roundedCorner[3]) : UNSET;

          this.fillGradientPositions.set(fillPositions);
          this.roundCorner.set(themePreset.roundedCorner ?? DEFAULT_ROUNDED_CORNER);
          this.fillGradientColors.set(themePreset.fill ?? fillColors);
          this.strokeGradientColor.set(themePreset.strokeGradientColor ?? strokeColor);
          this.shapeRoundCorner.set(themePreset.roundedCorner ?? roundCorner);
          this.strokeAnimationDuration.set(themePreset.strokeAnimationDuration ?? DEFAULT_STROKE_ANIMATION_DURATION);
          this.contextMenuButtonPreset.set(themePreset.buttonPreset ?? buttonPreset);
          return;
        }
      }
    }
    this.fillGradientPositions.set(fillPositions);
    this.roundCorner.set(DEFAULT_ROUNDED_CORNER);
    this.fillGradientColors.set(fillColors);
    this.strokeGradientColor.set(strokeColor);
    this.shapeRoundCorner.set(roundCorner);
    this.strokeAnimationDuration.set(DEFAULT_STROKE_ANIMATION_DURATION);
    this.contextMenuButtonPreset.set(buttonPreset);
  }

  onItemClickHandler(event: Event, id: Id) {
    this._$click.next({ event, id });
  }

  ngOnDestroy(): void {
    if (this._resizeObserer) {
      this._resizeObserer.disconnect();
      this._resizeObserer = undefined;
    }
    this._$click.complete();
  }
}
