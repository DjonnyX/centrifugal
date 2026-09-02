import { Component, computed, DestroyRef, effect, ElementRef, inject, input, OnDestroy, output, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map, switchMap, tap } from 'rxjs';
import { LocaleSensitiveDirective } from '@shared/localization';
import { Color, GradientColor, GradientColorPositions, RoundedCorner } from '@shared/types';
import { MessageSendButtonComponent } from '../message-send-button/message-send-button.component';
import { MessageButtonSendStates } from '../message-send-button/enums';
import { MessageButtonSaveState } from '../message-save-button/types';
import { MessageButtonSaveStates } from '../message-save-button/enums';
import { ITheme, ThemeService } from '@shared/theming';
import { SubstarateMode, SubstarateModes, SubstarateStyle, SubstarateStyles } from '@shared/components/substrate';
import { SubstrateModule } from '@shared/components/substrate/substrate.module';
import { ISize, NtControlModule } from 'centrifugal';

const DEFAULT_TEXTAREA_SIZE = 16,
  MAX_TEXTAREA_HEIGHT = 320,
  STROKE_WIDTH = 3,
  FILL_COLOR: GradientColor = ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)'],
  COLOR_POSITIONS: GradientColorPositions = [0, 1],
  ROUND_CORNER: RoundedCorner = [8, 8, 8, 8],
  HIDDEN = 'hidden',
  AUTO = 'auto',
  CLICK = 'click',
  FOCUS = 'focus',
  BLUR = 'blur';

@Component({
  selector: 'x-messaage-input',
  imports: [CommonModule, NtControlModule, LocaleSensitiveDirective, CdkTextareaAutosize, MessageSendButtonComponent, SubstrateModule],
  templateUrl: './messaage-input.component.html',
  styleUrl: './messaage-input.component.scss'
})
export class MessaageInputComponent implements OnDestroy {
  textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  editor = viewChild<ElementRef<HTMLDivElement>>('editor');

  text = input<string>();

  loading = input<boolean>(false);

  changeText = output<string | undefined>();

  onCreate = output<{ nativeEvent: Event, value: string | undefined }>();

  editingCancel = output<void>();

  mode = signal<SubstarateMode>(SubstarateModes.ROUNDED_RECTANGLE);

  type = signal<SubstarateStyle>(SubstarateStyles.NONE);

  fillGradientColors = signal<GradientColor | undefined>(FILL_COLOR);

  fillPositions = signal<GradientColorPositions>(COLOR_POSITIONS);

  shapeRoundCorner = signal<[number, number, number, number] | undefined>(ROUND_CORNER);

  strokeWidth = signal<number>(STROKE_WIDTH);

  strokeGradientColor = signal<GradientColor | undefined>(undefined);

  rippleEffectColor = signal<Color | undefined>(undefined);

  sendButtonFillPositions = signal<GradientColorPositions>([0, 1]);

  editingState: Signal<MessageButtonSaveState>;

  isMessageValid: Signal<boolean>;

  tmpValue = signal<string>('');

  containerBackground = signal<string>('none');

  focused = signal<boolean>(false);

  scrolled = signal<boolean>(false);

  theme: Signal<ITheme | undefined>;

  private _themeService = inject(ThemeService);

  private _destroyRef = inject(DestroyRef);

  private _resizeObserver: ResizeObserver | undefined;

  private _editorResizeObserver: ResizeObserver | undefined;

  bounds = signal<ISize>({
    width: this.textarea()?.nativeElement?.offsetWidth || DEFAULT_TEXTAREA_SIZE,
    height: this.textarea()?.nativeElement?.offsetHeight || DEFAULT_TEXTAREA_SIZE,
  });

  editorBounds = signal<ISize>({
    width: this.editor()?.nativeElement?.offsetWidth || DEFAULT_TEXTAREA_SIZE,
    height: this.editor()?.nativeElement?.offsetHeight || DEFAULT_TEXTAREA_SIZE,
  });

  private _onEditorResizeHandler = () => {
    const el = this.editor()?.nativeElement as HTMLDivElement;
    if (el && el.offsetWidth && el.offsetHeight) {
      this.editorBounds.set({ width: el.offsetWidth || DEFAULT_TEXTAREA_SIZE, height: el.offsetHeight || DEFAULT_TEXTAREA_SIZE });
    }
  }

  private _onContainerResizeHandler = () => {
    const el = this.textarea()?.nativeElement as HTMLTextAreaElement;
    if (el && el.offsetWidth && el.offsetHeight) {
      this.bounds.set({ width: el.offsetWidth || DEFAULT_TEXTAREA_SIZE, height: el.offsetHeight || DEFAULT_TEXTAREA_SIZE });
    }
  }

  constructor() {
    this._resizeObserver = new ResizeObserver(this._onContainerResizeHandler);
    this._editorResizeObserver = new ResizeObserver(this._onEditorResizeHandler);

    this.theme = toSignal(this._themeService.$theme);

    const $textarea = toObservable(this.textarea).pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
    ), $editor = toObservable(this.editor).pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
    );

    $editor.pipe(
      takeUntilDestroyed(),
      tap(editor => {
        if (this._editorResizeObserver) {
          this._editorResizeObserver.observe(editor, { box: "border-box" });
        }
        this._onEditorResizeHandler();
      }),
    ).subscribe();

    $textarea.pipe(
      takeUntilDestroyed(),
      tap(textarea => {
        if (this._resizeObserver) {
          this._resizeObserver.observe(textarea, { box: "border-box" });
        }
        this._onContainerResizeHandler();
      }),
    ).subscribe();

    $textarea.pipe(
      takeUntilDestroyed(),
      switchMap(textarea => {
        return fromEvent(textarea, FOCUS).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.focused.set(true);
          }),
        );
      }),
    ).subscribe();

    $textarea.pipe(
      takeUntilDestroyed(),
      switchMap(textarea => {
        return fromEvent(textarea, BLUR).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.focused.set(false);
          }),
        );
      }),
    ).subscribe();

    effect(() => {
      const loading = this.loading();
      this.type.set(loading ? SubstarateStyles.STROKE : SubstarateStyles.NONE);
    });

    effect(() => {
      const bounds = this.bounds(), textarea = this.textarea()?.nativeElement as HTMLTextAreaElement;
      if (bounds && textarea) {
        textarea.style.overflow = bounds.height < MAX_TEXTAREA_HEIGHT ? HIDDEN : AUTO;

        this.scrolled.set(bounds.height >= MAX_TEXTAREA_HEIGHT);
      }
    });

    this.editingState = computed(() => {
      const tmpValue = this.tmpValue();
      return (tmpValue && tmpValue.length > 0) ? MessageButtonSendStates.SEND : MessageButtonSendStates.CANCEL;
    });

    this.isMessageValid = computed(() => {
      const tmpValue = this.tmpValue();
      return (tmpValue !== undefined && tmpValue.length > 0);
    });

    effect(() => {
      const theme = this.theme();
      if (theme) {
        const preset = this._themeService.getPreset(theme.chat.messageCreator);
        if (preset) {
          const focus = this.focused(), textarea = this.textarea()?.nativeElement, editor = this.editor()?.nativeElement;
          if (textarea) {
            textarea.style.color = preset.input.color;
          }
          this.rippleEffectColor.set(preset.input.rippleColor);
          this.strokeGradientColor.set(preset.input.strokeGradientColor);
          if (editor) {
            editor.style.backgroundColor = preset.input.background;
            editor.style.border = focus ? preset.input.focusedOutline : preset.input.outline;
          }
          this.containerBackground.set(preset.background);
        }
      }
    });
  }

  reset() {
    const textarea = this.textarea()?.nativeElement;
    if (!!textarea) {
      textarea.value = '';
    }
    this.tmpValue.set('');
  }

  onInputHandler(e: Event) {
    const textarea = this.textarea(), value = textarea?.nativeElement.value ?? '';
    this.tmpValue.set(value);
    this.changeText.emit(value);
  }

  onSaveHandler(e: Event, state: MessageButtonSaveState) {
    const tmpValue = this.tmpValue();
    switch (state) {
      case MessageButtonSaveStates.SEND: {
        this.onCreate.emit({ nativeEvent: e, value: tmpValue ?? '' });
        break;
      }
      case MessageButtonSaveStates.CANCEL: {
        this.reset();
        this.editingCancel.emit();
        break;
      }
    }
  }

  onCancelEditingHandler(e: Event) {
    this.editingCancel.emit();
  }

  ngOnDestroy(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = undefined;
    }
    if (this._editorResizeObserver) {
      this._editorResizeObserver.disconnect();
      this._editorResizeObserver = undefined;
    }
  }
}
