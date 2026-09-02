import {
  AfterViewInit, Component, ComponentRef, computed, DestroyRef, effect, ElementRef, inject, OnDestroy, signal, Signal, ViewChild,
  viewChild, ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Observable, tap } from 'rxjs';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { IDialogTheme } from '@shared/theming/themes/interfaces/components/dialog';
import { GradientColor, GradientColorPositions, RoundedCorner } from '@shared/types';
import { IDialogData, IDialogOutput } from './interfaces';
import { ButtonGroupComponent } from '../button-group';
import { IButtonGroupItem } from '../button-group/interfaces';
import { formatCSSNumber } from '../utils';
import { SubstarateMode, SubstarateModes, SubstarateStyle, SubstarateStyles } from '../substrate';
import { LocaleSensitiveDirective } from '@shared/localization';
import { SubstrateModule } from '../substrate/substrate.module';
import { ISize } from 'centrifugal';

const DEFAULT_ROUND_CORNER: RoundedCorner = [8, 8, 8, 8],
  DEFAULT_FILL_POSITIONS: GradientColorPositions = [0, 1],
  DEFAULT_STROKE_ANIMATION_DURATION = 1000,
  INHERIT = 'inherit',
  NONE = 'none';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-dialog',
  imports: [CommonModule, LocaleSensitiveDirective, SubstrateModule, ButtonGroupComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contentTemplate', { read: ViewContainerRef })
  contentTemplate!: ViewContainerRef;

  content = viewChild<ElementRef<HTMLDivElement>>('content');

  title = viewChild<ElementRef<HTMLHeadingElement>>('title');

  message = viewChild<ElementRef<HTMLHeadingElement>>('message');

  private _dialogRef = inject<DialogRef<IDialogData, IDialogOutput>>(DialogRef<IDialogData>);

  data = inject<IDialogData>(DIALOG_DATA);

  mode = signal<SubstarateMode>(SubstarateModes.ROUNDED_RECTANGLE);

  type = signal<SubstarateStyle>(SubstarateStyles.STROKE);

  strokeColor = signal<GradientColor | undefined>(undefined);

  roundCorner = signal<RoundedCorner | undefined>(DEFAULT_ROUND_CORNER);

  fillColors = signal<GradientColor | undefined>(undefined);

  fillPositions = signal<GradientColorPositions | undefined>(DEFAULT_FILL_POSITIONS);

  strokeAnimationDuration = signal<number>(DEFAULT_STROKE_ANIMATION_DURATION);

  readonly bounds = signal<ISize>({ width: 250, height: 250 });

  buttonGroupItems: Signal<Array<IButtonGroupItem & { data?: any }>>;

  styles: Signal<{ [prop: string]: string }>;

  theme: Signal<ITheme | undefined>;

  private _componentData: any;

  private _resizeObserer: ResizeObserver | undefined;

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _themeService = inject(ThemeService);

  private _destroyRef = inject(DestroyRef);

  private _onResizeHandler = () => {
    const el = this._elementRef.nativeElement as HTMLDivElement,
      { width, height } = el.getBoundingClientRect();
    this.bounds.set({ width, height });
  };

  constructor() {
    const el = this._elementRef.nativeElement as HTMLDivElement;
    this._resizeObserer = new ResizeObserver(this._onResizeHandler);
    this._resizeObserer.observe(el);

    this.theme = toSignal(this._themeService.$theme);

    this.buttonGroupItems = computed(() => {
      const data = this.data;
      if (Array.isArray(data?.actions)) {
        return data.actions.map(({ action, name, preset, data, }) => ({
          id: action,
          content: name,
          preset,
          data,
        }));
      }
      return [];
    });

    this.styles = computed(() => {
      const data = this.data, result: { [prop: string]: string } = {};
      if (Array.isArray(data?.actions)) {
        result['grid-template-columns'] = `repeat(${data.actions.length}, auto)`;
      }
      return result;
    });

    effect(() => {
      const theme = this.theme(), data = this.data, preset = data.preset, content = this.content()?.nativeElement,
        title = this.title()?.nativeElement, message = this.message()?.nativeElement, fillColors = this.fillColors(), strokeColor = this.strokeColor();
      if (preset && theme && content && title && message) {
        const themePreset = this._themeService.getPreset<IDialogTheme>(theme.presets[preset]);
        if (themePreset) {
          title.style.fontSize = themePreset.title.fontSize ? formatCSSNumber(formatCSSNumber(themePreset.title.fontSize)) : INHERIT;
          title.style.color = themePreset.title.color ? formatCSSNumber(themePreset.title.color) : INHERIT;
          title.style.textAlign = themePreset.title.textAlign ? formatCSSNumber(themePreset.title.textAlign) : INHERIT;
          title.style.fontWeight = themePreset.title.fontWeight ? formatCSSNumber(themePreset.title.fontWeight) : INHERIT;
          title.style.textTransform = themePreset.title.textTransform ? formatCSSNumber(themePreset.title.textTransform) : INHERIT;

          message.style.fontSize = themePreset.message.fontSize ? formatCSSNumber(formatCSSNumber(themePreset.message.fontSize)) : INHERIT;
          message.style.color = themePreset.message.color ? formatCSSNumber(themePreset.message.color) : INHERIT;
          message.style.textAlign = themePreset.message.textAlign ? formatCSSNumber(themePreset.message.textAlign) : INHERIT;
          message.style.fontWeight = themePreset.message.fontWeight ? formatCSSNumber(themePreset.message.fontWeight) : INHERIT;
          message.style.textTransform = themePreset.message.textTransform ? formatCSSNumber(themePreset.message.textTransform) : INHERIT;

          content.style.padding = themePreset.padding ?? NONE;

          this.roundCorner.set(themePreset.roundedCorner ?? DEFAULT_ROUND_CORNER);
          this.fillColors.set(themePreset.fill as GradientColor ?? fillColors);
          this.strokeColor.set(themePreset.strokeGradientColor ?? strokeColor);
          this.strokeAnimationDuration.set(themePreset.strokeAnimationDuration ?? DEFAULT_STROKE_ANIMATION_DURATION);
          return;
        }
      }
      this.roundCorner.set(DEFAULT_ROUND_CORNER);
      this.fillColors.set(fillColors);
      this.strokeColor.set(strokeColor);
      this.strokeAnimationDuration.set(DEFAULT_STROKE_ANIMATION_DURATION);
    });
  }

  ngAfterViewInit(): void {
    const data = this.data, contentTemplate = this.contentTemplate;
    if (contentTemplate && data.content !== undefined) {
      contentTemplate.clear();
      const componentRef: ComponentRef<{ $changes: Observable<any> }> = contentTemplate.createComponent(data.content);
      componentRef.instance.$changes.pipe(
        takeUntilDestroyed(this._destroyRef),
        tap(v => {
          this._componentData = v;
        }),
      ).subscribe();
    }
  }

  close(data?: any) {
    this._dialogRef.close(data);
  }

  onButtonClickHandler(item: IButtonGroupItem & { data?: any }) {
    this.close({ data: item.data, componentData: this._componentData });
  }

  ngOnDestroy(): void {
    if (this._resizeObserer) {
      this._resizeObserer.disconnect();
      this._resizeObserer = undefined;
    }
  }
}
