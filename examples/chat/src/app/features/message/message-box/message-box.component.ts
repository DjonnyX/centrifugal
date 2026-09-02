import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, DestroyRef, effect, ElementRef, inject, input, OnDestroy, output, signal, Signal, viewChild } from '@angular/core';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, Observable, Subject, switchMap, take, tap } from 'rxjs';
import { MessageButtonSaveState, MessageButtonSaveStates, MessageMenuButtonComponent, MessageSaveButtonComponent } from '@entities/message';
import { CalcFillPositionsDirective, LongPressDirective } from '@shared/directives';
import { IMessageItemData } from "@shared/models/message";
import { ContextMenuComponent, IContextMenuCollection } from '@shared/components/context-menu';
import { GradientColorPositions } from '@shared/types';
import { DialogService } from '@shared/components/dialog/dialog.service';
import { ButtonPresets, ThemeService } from '@shared/theming';
import { ContextMenuPresets, DialogPresets } from '@shared/theming/themes/presets';
import { ITheme } from '@shared/theming';
import { ILocalization, LocalizationService, LocaleSensitiveDirective, TextDirections } from '@shared/localization';
import { IProxyCollectionItem } from '@widgets/messages/messages/utils/proxy-collection';
import { DialogDeleteContentComponent } from '@entities/message/dialog-delete-content/dialog-delete-content.component';
import { MessageComponent } from '../message/message.component';
import { IMessageParams } from '../message/interfaces';
import { IDeleteEventData } from './interfaces';
import { MessageService } from '@widgets/messages';
import { MessageTypes } from '@shared/enums';
import { Id, ISize, NtListPublicService, IDisplayObjectConfig, IDisplayObjectMeasures, IVirtualListItem } from 'centrifugal';

const IN = 'in', OUT = 'out',
  CLASS_RESETED = 'reseted', CLASS_NEW = 'new', CLASS_IN = 'in', CLASS_OUT = 'out', CLASS_SIMPLE = 'simple', CLASS_END_OF_MESSAGES = 'end-of-messages',
  CLASS_REMOVAL = 'removal', CLASS_DELETED = 'deleted', CLASS_ANIMATE = 'animate', CLASS_EDITED = 'edited', CLASS_RTL = TextDirections.RTL,
  CLASS_SELECTED = 'selected', CLASS_FOCUSED = 'focused', CLASS_FIRST_IN_GROUP = 'first-in-group', CLASS_LAST_IN_GROUP = 'last-in-group',
  CLASS_HAS_MULTICONTENT = 'has-multicontent', DATA_PROP_IMAGE = 'image', DATA_PROP_REMOVAL = 'removal', DATA_PROP_DELETED = 'deleted',
  DATA_PROP_ANIMATE = 'animate', CONFIG_PROP_SELECTED = 'selected', CONFIG_PROP_PREPARED = 'prepared', CONFIG_PROP_FOCUSED = 'focused';

enum ContextMenuItemIds {
  EDIT = 'edit',
  DELETE = 'delete',
  CANCEL = 'cancel',
  QUOTE = 'quote',
}

const getContextMenuNormal = (localization: ILocalization | undefined): IContextMenuCollection => [
  {
    id: ContextMenuItemIds.EDIT,
    name: localization?.chat.messages.message.contextMenu.menu.edit ?? '',
  },
  {
    id: ContextMenuItemIds.QUOTE,
    name: localization?.chat.messages.message.contextMenu.menu.quote ?? '',
  },
  {
    id: ContextMenuItemIds.DELETE,
    name: localization?.chat.messages.message.contextMenu.menu.delete ?? '',
  },
],
  getContextMenuEditing = (localization: ILocalization | undefined): IContextMenuCollection => [
    {
      id: ContextMenuItemIds.CANCEL,
      name: localization?.chat.messages.message.contextMenu.menu.cancel ?? '',
    },
    {
      id: ContextMenuItemIds.QUOTE,
      name: localization?.chat.messages.message.contextMenu.menu.quote ?? '',
    },
    {
      id: ContextMenuItemIds.DELETE,
      name: localization?.chat.messages.message.contextMenu.menu.delete ?? '',
    },
  ];

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-message-box',
  imports: [CommonModule, MessageComponent, LongPressDirective, CalcFillPositionsDirective, MessageMenuButtonComponent, MessageSaveButtonComponent,
    CdkMenuTrigger, ContextMenuComponent, LocaleSensitiveDirective],
  providers: [DialogService],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.scss'
})
export class MessageBoxComponent implements AfterViewInit, OnDestroy {
  private _container = viewChild<ElementRef<HTMLDivElement>>('container');

  private _menuButton = viewChild<MessageMenuButtonComponent>('menuButton');

  messageType = input<MessageTypes.MESSAGE | MessageTypes.QUOTE | 'message' | 'quote'>(MessageTypes.MESSAGE);

  api = input<NtListPublicService>();

  data = input<IVirtualListItem<IProxyCollectionItem<IMessageItemData>> | null>(null);

  prevData = input<IVirtualListItem<IProxyCollectionItem<IMessageItemData>> | null>(null);

  nextData = input<IVirtualListItem<IProxyCollectionItem<IMessageItemData>> | null>(null);

  config = input<IDisplayObjectConfig & { [prop: string]: any } | null>(null);

  measures = input<IDisplayObjectMeasures | null>(null);

  reseted = input<boolean>(false);

  searchPattern = input<Array<string>>([]);

  edit = output<{ nativeEvent: Event, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, selected: boolean }>();

  edited = output<{ nativeEvent: Event, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, config: IDisplayObjectConfig, value: string | undefined }>();

  editingCancel = output<void>();

  quoteSelect = output<Id | null>();

  changeText = output<string | undefined>();

  delete = output<{ data: IDeleteEventData | undefined, componentData: boolean; }>();

  private tmpValue = signal<string | undefined>(undefined);

  contextMenuPreset = signal<ContextMenuPresets>(ContextMenuPresets.PRIMARY);

  initialized = signal<boolean>(false);

  classes: Signal<{ [className: string]: boolean; }>;

  params: Signal<IMessageParams>;

  longPressActive = signal<boolean>(false);

  editingState: Signal<MessageButtonSaveState>;

  isSaving: Signal<boolean>;

  isDeleting: Signal<boolean>;

  theme: Signal<ITheme | undefined>;

  contextMenuItems: Signal<IContextMenuCollection>;

  fillPositions: Signal<GradientColorPositions>;

  menuButtonFillPositions = signal<GradientColorPositions>([0, 1]);

  sendButtonFillPositions = signal<GradientColorPositions>([0, 1]);

  contextMenuFillPositions = signal<GradientColorPositions>([0, 1]);

  isMessageValid: Signal<boolean>;

  localization: Signal<ILocalization | undefined>;

  locale: Signal<string | undefined>;

  private _messageService = inject(MessageService);

  private _$longPressPrevent = this._messageService?.virtualList?.$scroll as unknown as Observable<void>;
  readonly $longPressPrevent = this._$longPressPrevent;

  readonly longPressDuration = 1000;

  private _dialogService = inject(DialogService);

  private _destroyRef = inject(DestroyRef);

  private _themeService = inject(ThemeService);

  private _localizationService = inject(LocalizationService);

  private _$menuOpen = new Subject<void>();
  protected $menuOpen = this._$menuOpen.asObservable();

  private _resizeObserver: ResizeObserver | undefined;

  bounds = signal<ISize>({
    width: this._container()?.nativeElement?.offsetWidth || 0,
    height: this._container()?.nativeElement?.offsetHeight || 0,
  });

  private _onContainerResizeHandler = () => {
    const el = this._container()?.nativeElement as HTMLDivElement;
    if (el) {
      const width = el.offsetWidth, height = el.offsetHeight, bounds = this.bounds();
      if (bounds.width === width && bounds.height === height) {
        return;
      }
      this.bounds.set({ width, height });
    }
  }

  constructor() {
    this.localization = toSignal(this._localizationService.$localization);
    this.locale = toSignal(this._localizationService.$locale);
    const $menuOpen = this.$menuOpen, $menuButton = toObservable(this._menuButton),
      $container = toObservable(this._container), $data = toObservable(this.data);

    this._resizeObserver = new ResizeObserver(this._onContainerResizeHandler);

    $container.pipe(
      takeUntilDestroyed(),
      filter(v => !!v),
      map(v => v.nativeElement),
      tap(container => {
        if (this._resizeObserver) {
          this._resizeObserver.observe(container, { box: "border-box" });
        }
        this._onContainerResizeHandler();
      }),
    ).subscribe();

    $menuOpen.pipe(
      takeUntilDestroyed(),
      switchMap(() => $menuButton.pipe(
        filter(v => !!v),
        take(1),
        tap((menuButton) => {
          if (menuButton) {
            menuButton.click();
          }
        }),
      )),
    ).subscribe();

    this.theme = toSignal(this._themeService.$theme);

    this.params = computed(() => {
      const locale = this.locale(), reseted = this.reseted(), initialized = this.initialized(), data = this.data(),
        prevData = this.prevData(), nextData = this.nextData();
      return {
        reseted: !initialized || reseted,
        isRTL: this._localizationService.textDirection === TextDirections.RTL,
        isIncoming: data?.data?.incomType === IN,
        isOutgoing: data?.data?.incomType === OUT,
        prevIsIncoming: prevData?.data?.incomType === IN,
        prevIsOutgoing: prevData?.data?.incomType === OUT,
        nextIsIncoming: nextData?.data?.incomType === IN,
        nextIsOutgoing: nextData?.data?.incomType === OUT,
        type: data?.data.type,
        prevType: prevData?.data.type,
        nextType: nextData?.data.type,
      };
    });

    this.fillPositions = computed(() => {
      const measures = this.measures();
      return [`${measures?.absoluteStartPositionPercent ?? 0}`, `${(measures?.absoluteEndPositionPercent ?? 0)}`];
    });

    this.contextMenuItems = computed(() => {
      const localization = this.localization();
      return this.data()?.edited ? [...getContextMenuEditing(localization)] : [...getContextMenuNormal(localization)];
    });

    this.isMessageValid = computed(() => {
      const data = this.data(), tmpValue = this.tmpValue();
      return (!!data && data.data.text?.length > 0) && (tmpValue !== undefined && tmpValue.length > 0);
    });

    this.isSaving = computed(() => {
      const data = this.data();
      return data?.processing === true;
    });

    this.isDeleting = computed(() => {
      const data = this.data();
      return data?.deleting === true || data?.deleted === true || data?.removal === true;
    });

    this.editingState = computed(() => {
      const data = this.data(), tmpValue = this.tmpValue();
      return (tmpValue !== undefined && tmpValue.length > 0) && tmpValue !== data?.data.text ? MessageButtonSaveStates.SEND : MessageButtonSaveStates.CANCEL;
    });

    this.classes = computed(() => {
      const params = this.params(), { reseted } = params, initialized = this.initialized();
      if (reseted) {
        return { [CLASS_RESETED]: !initialized || reseted, } as any;
      }

      const data = this.data(), config = this.config() as any,
        isIn = params.isIncoming, isOut = params.isOutgoing, isPrevIn = params.prevIsIncoming, isPrevOut = params.prevIsOutgoing,
        isNextIn = params.nextIsIncoming, isNextOut = params.nextIsOutgoing, firstInGroup = params.prevType === MessageTypes.GROUP && params.type !== MessageTypes.GROUP,
        lastInGroup = params.nextType === MessageTypes.GROUP && params.type !== MessageTypes.GROUP;
      return {
        [CLASS_NEW]: data?.new === true, [CLASS_IN]: isIn, [CLASS_OUT]: isOut, [CLASS_SIMPLE]: (isIn && isPrevIn) || (isOut && isPrevOut), [CLASS_DELETED]: data?.[DATA_PROP_DELETED] == true,
        [CLASS_REMOVAL]: data?.[DATA_PROP_REMOVAL] == true, [CLASS_ANIMATE]: data?.[DATA_PROP_ANIMATE] == true, [CLASS_END_OF_MESSAGES]: (isIn && !isNextIn) || (isOut && !isNextOut),
        [CLASS_FIRST_IN_GROUP]: firstInGroup, [CLASS_LAST_IN_GROUP]: lastInGroup, [CLASS_EDITED]: data?.edited == true, [CONFIG_PROP_PREPARED]: config.prepared,
        [CLASS_RTL]: this._localizationService.textDirection === TextDirections.RTL, [CLASS_SELECTED]: config?.[CONFIG_PROP_SELECTED], [CLASS_FOCUSED]: config?.[CONFIG_PROP_FOCUSED],
        [CLASS_HAS_MULTICONTENT]: data?.[DATA_PROP_IMAGE] !== undefined,
      };
    });

    effect(() => {
      const data = this.data(), config = this.config(), theme = this.theme(), containerElement = this._container()?.nativeElement;
      if (data && config && theme && containerElement) {
        const preset = this._themeService.getPreset(theme.chat.messages.message.container);
        if (data.edited) {
          containerElement.style.backgroundColor = preset.edited.background;
        } else if (config.selected) {
          containerElement.style.backgroundColor = preset.selected.background;
        } else {
          containerElement.style.backgroundColor = preset.normal.background;
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.initialized.set(true);
  }

  onEditItemHandler(event: Event, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, selected: boolean) {
    this.edit.emit({ nativeEvent: event, item, selected });
  }

  onDeleteItemHandler(nativeEvent: Event, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, config: IDisplayObjectConfig, measures: ISize) {
    const data: IDeleteEventData = { nativeEvent, item: item!, config: config!, measures: measures! };
    this._dialogService.open<{ data: IDeleteEventData | undefined, componentData: boolean }>({
      title: this._localizationService.localization.chat.messages.message.dialog.delete.title,
      message: this._localizationService.localization.chat.messages.message.dialog.delete.message,
      content: DialogDeleteContentComponent,
      actions: [
        {
          action: "cancel",
          name: this._localizationService.localization.chat.messages.message.dialog.delete.cancel,
          preset: ButtonPresets.CANCEL,
          data: undefined,
        },
        {
          action: "delete",
          name: this._localizationService.localization.chat.messages.message.dialog.delete.delete,
          preset: ButtonPresets.SUCCESS,
          data,
        },
      ],
      preset: DialogPresets.PRIMARY,
    }).pipe(
      takeUntilDestroyed(this._destroyRef),
      filter((data) => !!data),
      tap(({ data, componentData }) => {
        this.delete.emit({ data: data, componentData: componentData });
      }),
    ).subscribe();
  }

  onSaveHandler(e: Event, data: IVirtualListItem, config: IDisplayObjectConfig, state: MessageButtonSaveState) {
    const item = this.data();
    if (item) {
      switch (state) {
        case MessageButtonSaveStates.SEND: {
          this.edited.emit({ nativeEvent: e, item, config, value: item.tmpText });
          break;
        }
        case MessageButtonSaveStates.CANCEL: {
          e.stopImmediatePropagation();
          this.editingCancel.emit();
          this.api()?.select(data['id'], false);
          break;
        }
      }
    }
  }

  onCancelEditingHandler(e: Event) {
    this.editingCancel.emit();
    this.api()?.select(this.data()!.id, false);
  }

  onMessageChangeValueHandler(v: string | undefined) {
    this.tmpValue.set(v);
    this.changeText.emit(v);
  }

  onClickContextMenuHandler({ id, event }: { id: Id, event: Event }, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>,
    config: IDisplayObjectConfig, measures: ISize) {
    switch (id) {
      case ContextMenuItemIds.EDIT: {
        this.onEditItemHandler(event, item, config.selected);
        break;
      }
      case ContextMenuItemIds.CANCEL: {
        this.onCancelEditingHandler(event);
        break;
      }
      case ContextMenuItemIds.QUOTE: {
        // 
        break;
      }
      case ContextMenuItemIds.DELETE: {
        this.onDeleteItemHandler(event, item, config, measures);
        break;
      }
    }
  }

  onMenuButtonFillPositionsHandler(fillPositions: GradientColorPositions) {
    this.menuButtonFillPositions.set(fillPositions);
  }

  onSendButtonFillPositionsHandler(fillPositions: GradientColorPositions) {
    this.sendButtonFillPositions.set(fillPositions);
  }

  onContextMenuFillPositionsHandler(fillPositions: GradientColorPositions) {
    this.contextMenuFillPositions.set(fillPositions);
  }

  onLongPressActive(value: boolean) {
    this.longPressActive.set(value);
  }

  openMenu() {
    this.longPressActive.set(false);
    this._$menuOpen.next();
  }

  onQuoteSelectHandler(id: Id | null) {
    this.quoteSelect.emit(id);
  }

  onResourcesLoadedHandler() {
    // etc
  }

  ngOnDestroy(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = undefined;
    }
    this._$menuOpen.complete();
  }
}
