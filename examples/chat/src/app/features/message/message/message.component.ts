import { CommonModule } from '@angular/common';
import {
  Component, computed, effect, ElementRef, inject, input, output, signal, Signal, viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import {
  MessageSubstrateComponent, MessageSubstarateMode, MessageSubstarateModes, EditableTextComponent,
  MessageSubstarateStyle, MessageSubstarateStyles,
} from '@entities/message';
import { IMessageItemData } from "@shared/models/message";
import { Color, GradientColor, GradientColorPositions } from '@shared/types';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { IProxyCollectionItem } from '@widgets/messages/messages/utils/proxy-collection';
import { IMessageParams } from './interfaces/message-params';
import { formatTime } from '@shared/utils';
import { MessageTypes } from '@shared/enums';
import { MessageQuoteComponent } from '../quote/message-quote.component';
import { StaticClickDirective } from '@shared/directives';
import { Id, ISize, NtListPublicService, IDisplayObjectConfig, IDisplayObjectMeasures, IVirtualListItem } from 'centrifugal';

const DEFAULT_STROKE_ANIMATION_DURATION = 1000,
  DEFAULT_STROKE_WIDTH = 3,
  DEFAULT_MAX_DISTANCE = 40,
  DEFAULT_STROKE_COLOR: GradientColor = ['rgba(255,255,255,0)', 'rgba(195, 0, 255, 0.17)'],
  DEFAULT_FILL_COLOR: GradientColor = ['rgb(255, 255, 255)', 'rgb(185, 210, 233)'],
  CLASS_REMOVAL = 'removal',
  CLASS_SELECTED = 'selected',
  CLASS_FOCUSED = 'focused',
  IN = 'in',
  OUT = 'out';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-message',
  imports: [CommonModule, EditableTextComponent, MessageSubstrateComponent, MessageQuoteComponent, StaticClickDirective,],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  host: {
    'class': 'message',
  },
  encapsulation: ViewEncapsulation.Emulated,
})
export class MessageComponent {
  private _substrateContainer = viewChild<ElementRef<HTMLDivElement>>('substrateContainer');

  private _wrapper = viewChild<ElementRef<HTMLDivElement>>('wrapper');

  private _container = viewChild<ElementRef<HTMLDivElement>>('container');

  api = input<NtListPublicService>();

  data = input<IVirtualListItem<IProxyCollectionItem<IMessageItemData>> | null>(null);

  config = input<IDisplayObjectConfig | null>(null);

  measures = input<IDisplayObjectMeasures | null>(null);

  params = input.required<IMessageParams>();

  messageType = input<MessageTypes.MESSAGE | MessageTypes.QUOTE | 'message' | 'quote'>(MessageTypes.MESSAGE);

  longPressActive = input<boolean>(false);

  searchPattern = input<Array<string>>([]);

  classes = input.required<{ [className: string]: boolean; }>();

  fillPositions = input<GradientColorPositions>();

  editedText = output<{ nativeEvent: Event, item: IVirtualListItem<IMessageItemData> }>();

  quoteSelect = output<Id | null>();

  changeValue = output<string | undefined>();

  resourcesLoaded = output<void>();

  substarateMode: Signal<MessageSubstarateMode>;

  substrateType = signal<MessageSubstarateStyle>(MessageSubstarateStyles.NONE);

  strokeAnimationDuration = signal<number>(DEFAULT_STROKE_ANIMATION_DURATION);

  substrateStyles = signal<{ [styleName: string]: any; }>({});

  editing = signal<boolean>(false);

  strokeColor = signal<GradientColor | undefined>(undefined);

  strokeWidth = signal<number>(DEFAULT_STROKE_WIDTH);

  fillColors = signal<GradientColor>(DEFAULT_FILL_COLOR);

  rippleColor = signal<Color | undefined>(undefined);

  theme: Signal<ITheme | undefined>;

  themeType: Signal<'in' | 'out'>;

  time: Signal<string | undefined>;

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _themeService = inject(ThemeService);

  readonly maxStaticClickDistance = DEFAULT_MAX_DISTANCE;

  bounds = signal<ISize>({
    width: this._container()?.nativeElement?.offsetWidth || 0,
    height: this._container()?.nativeElement?.offsetHeight || 0,
  });

  private _onContainerResizeHandler = () => {
    const el = this._container()?.nativeElement as HTMLDivElement;
    if (!!el) {
      const width = el.offsetWidth, height = el.offsetHeight, bounds = this.bounds();
      if (width === bounds?.width && height === bounds?.height) {
        return;
      }
      const substrate = this._substrateContainer()?.nativeElement, wrapper = this._wrapper()?.nativeElement;
      if (!!substrate && !!wrapper) {
        const w = substrate.offsetWidth, opacity = (w < 90) ? '0' : '1';
        wrapper.style.opacity = opacity;
      }
      this.bounds.set({ width, height });
    }
  }

  actualBounds: Signal<ISize>;

  someCondition = true;

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

    const $listApi = toObservable(this.api),
      $tick = $listApi.pipe(
        takeUntilDestroyed(),
        distinctUntilChanged(),
        filter(v => !!v),
        switchMap(api => {
          return api.$tick;
        }),
      );

    $tick.pipe(
      takeUntilDestroyed(),
      tap(() => {
        this._onContainerResizeHandler();
      }),
    ).subscribe();

    effect(() => {
      const classes = this.classes(), element = this._elementRef?.nativeElement as HTMLElement;
      if (element) {
        if (classes) {
          for (const cName in classes) {
            if (classes[cName]) {
              element.classList.add(cName);
            } else {
              element.classList.remove(cName);
            }
          }
        }
      }
    });

    this.time = computed(() => {
      const data = this.data();
      return data ? formatTime(data.data.dateTime) : undefined;
    });

    this.themeType = computed(() => {
      return this.params()?.isIncoming === true ? IN : OUT;
    });

    this.actualBounds = computed(() => {
      const bounds = this.bounds(), measures = this.measures();
      if (bounds) {
        return { width: bounds.width || (measures?.width as number) || 0, height: bounds.height || (measures?.height as number) || 0 };
      } if (measures) {
        return { width: (measures?.width as number) || 0, height: (measures?.height as number) || 0 };
      }
      return { width: 0, height: 0 };
    });

    effect(() => {
      const data = this.data(), longPressActive = this.longPressActive(), currentTheme = this.theme();
      if (data && currentTheme) {
        const preset = this._themeService.getPreset(currentTheme.chat.messages.message.styles);
        if (longPressActive) {
          this.substrateType.set(MessageSubstarateStyles.STROKE);
          this.strokeColor.set(preset.longPress.stroke ?? DEFAULT_STROKE_COLOR);
          this.strokeAnimationDuration.set(preset.longPress.strokeAnimationDuration ?? DEFAULT_STROKE_ANIMATION_DURATION);
        } else if (data?.processing) {
          this.substrateType.set(MessageSubstarateStyles.STROKE);
          this.strokeColor.set(preset.processing.stroke ?? DEFAULT_STROKE_COLOR);
          this.strokeAnimationDuration.set(preset.processing.strokeAnimationDuration ?? DEFAULT_STROKE_ANIMATION_DURATION);
        } else if (data?.removal) {
          this.substrateType.set(MessageSubstarateStyles.STROKE);
          this.strokeColor.set(preset.removing.stroke ?? DEFAULT_STROKE_COLOR);
          this.strokeAnimationDuration.set(preset.removing.strokeAnimationDuration ?? DEFAULT_STROKE_ANIMATION_DURATION);
        } else {
          this.substrateType.set(MessageSubstarateStyles.NONE);
          this.strokeColor.set(DEFAULT_STROKE_COLOR);
        }
      } else {
        this.substrateType.set(MessageSubstarateStyles.NONE);
        this.strokeColor.set(DEFAULT_STROKE_COLOR);
      }
    });

    effect(() => {
      const theme = this.theme(), type = this.themeType();
      if (theme) {
        const preset = this._themeService.getPreset(theme?.chat.messages.message.content[type]);
        if (preset) {
          this.rippleColor.set(preset.rippleColor);
        }
      }
    });

    effect(() => {
      const classes = this.classes(), type = this.themeType(), currentTheme = this.theme(), containerElement = this._container()?.nativeElement;
      if (containerElement) {
        const preset = this._themeService.getPreset(currentTheme?.chat.messages.message.content[type]);
        if (preset) {
          if (classes[CLASS_REMOVAL] && classes[CLASS_SELECTED]) {
            this.fillColors.set(preset.removalSelected.fill ?? DEFAULT_FILL_COLOR);
            this.strokeWidth.set(preset.removalSelected.strokeWidth ?? DEFAULT_STROKE_WIDTH);
            containerElement.style.color = preset.removalSelected.color;
          } else if (classes[CLASS_REMOVAL]) {
            this.fillColors.set(preset.removal.fill ?? DEFAULT_FILL_COLOR);
            this.strokeWidth.set(preset.removal.strokeWidth ?? DEFAULT_STROKE_WIDTH);
            containerElement.style.color = preset.removal.color;
          } else if (classes[CLASS_SELECTED] && classes[CLASS_FOCUSED]) {
            this.fillColors.set(preset.focusedSelected.fill ?? DEFAULT_FILL_COLOR);
            this.strokeWidth.set(preset.focusedSelected.strokeWidth ?? DEFAULT_STROKE_WIDTH);
            containerElement.style.color = preset.focusedSelected.color;
          } else if (classes[CLASS_SELECTED]) {
            this.fillColors.set(preset.selected.fill ?? DEFAULT_FILL_COLOR);
            this.strokeWidth.set(preset.selected.strokeWidth ?? DEFAULT_STROKE_WIDTH);
            containerElement.style.color = preset.selected.color;
          } else if (classes[CLASS_FOCUSED]) {
            this.fillColors.set(preset.focused.fill ?? DEFAULT_FILL_COLOR);
            this.strokeWidth.set(preset.focused.strokeWidth ?? DEFAULT_STROKE_WIDTH);
            containerElement.style.color = preset.focused.color;
          } else {
            this.fillColors.set(preset.normal.fill ?? DEFAULT_FILL_COLOR);
            this.strokeWidth.set(preset.normal.strokeWidth ?? DEFAULT_STROKE_WIDTH);
            containerElement.style.color = preset.normal.color;
          }
        }
      }
    });

    toObservable(this.data).pipe(
      takeUntilDestroyed(),
      tap(data => {
        this.editing.set(data?.edited === true);
      }),
    ).subscribe();

    this.substarateMode = computed(() => {
      const params = this.params(), { isIncoming: isIn, prevIsIncoming: isPrevIn, prevType, type, isRTL } = params;
      if ((prevType !== MessageTypes.GROUP && type !== MessageTypes.GROUP) && (isIn === isPrevIn)) {
        return isRTL ? isIn ? MessageSubstarateModes.RIGHT : MessageSubstarateModes.LEFT :
          (isIn ? MessageSubstarateModes.LEFT : MessageSubstarateModes.RIGHT);
      }
      return isRTL ? (isIn ? MessageSubstarateModes.IN_RIGHT : MessageSubstarateModes.IN_LEFT) :
        (isIn ? MessageSubstarateModes.IN_LEFT : MessageSubstarateModes.IN_RIGHT);
    });
  }

  onImageLoadedHandler() {
    this.resourcesLoaded.emit();
  }

  onTextAreaClickHandler(e: Event) {
    e.stopImmediatePropagation();
  }

  onEditedTextHandler(value: string | undefined, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>) {
    item.tmpText = value;
    this.changeValue.emit(value);
  }

  onClickQuoteHandler(e: Event) {
    e.stopImmediatePropagation();
    e.preventDefault();
    this.quoteSelect.emit(this.data()?.data?.quoteId ?? null);
  }
}
