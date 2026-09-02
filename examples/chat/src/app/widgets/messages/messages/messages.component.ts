import { Component, computed, DestroyRef, effect, ElementRef, inject, input, OnDestroy, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError, combineLatest, debounceTime, delay, filter, map, of, Subject, switchMap, tap, throwError,
} from 'rxjs';
import { MessagesLoadingIndicatorComponent } from '@entities/messages';
import { MessageGroupComponent, MessagesTypingIndicatorComponent } from '@entities/message';
import { IDeleteEventData, MessageBoxComponent } from '@features/message';
import {
  NtListModule, FocusAlignments, INtListAnimationParams, IDisplayObjectConfig, IScrollEvent, IVirtualListCollection, IVirtualListItem,
  IVirtualListItemConfigMap, NtListPublicService, IScrollingSettings, NtListComponent, IRenderVirtualListItemConfig,
} from 'centrifugal';
import { IMessageItemData } from "@shared/models/message";
import { MessageTypes } from '@shared/enums';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { ILocalization, LocaleSensitiveDirective, LocalizationService } from '@shared/localization';
import { resourceManager } from '@shared/utils/resource-manager';
import { StaticClickDirective } from '@shared/directives';
import { MessagesService } from '../messages.service';
import { fillConfigMap } from './utils/fill-config-map';
import { validateCollection, validateMessage } from './utils/validate-collection';
import { MessageService } from '../message.service';
import { MessagesNotificationService } from '../messages-notification.service';
import { generateTypingIndicator, TYPING_INDICATOR_INDEX } from './utils/generate-typing-indicator';
import { CollectionItem, IProxyCollectionItem, ProxyCollection, ProxyCollectionEvents } from './utils/proxy-collection';
import { createGroups } from './utils/create-groups';
import { MessageScrollToEndButtonComponent } from '@entities/message/message-scroll-to-end-button/message-scroll-to-end-button.component';
import { MessageUnmailedSeparatorComponent } from '@entities/message/message-unmailed-separator/message-unmailed-separator.component';
import { CustomScrollBarTheme } from '@shared/components/custom-scrollbar/interfaces/custom-scrollbar-theme';
import { CustomScrollbarModule } from '@shared/components/custom-scrollbar/custom-scrollbar.module';
import { Id, ISize } from 'centrifugal';

const ROOT_VAR_DELETED_ITEM_HEIGHT = '--deleted-item-height',
  SCROLLBAR_PRESET = 'x-scrollbar-secondary',
  MIN_ITEM_HEIGHT = 28,
  CHUNK_SIZE = 200;

const SCROLLING_SETTINGS: IScrollingSettings = {
  frictionalForce: 0.035,
  maxDuration: 6000,
  mass: 0.005,
  maxDistance: 45000,
  speedScale: 10,
  optimization: true,
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-messages',
  imports: [
    CommonModule, MessageBoxComponent, MessageGroupComponent, NtListModule, MessagesTypingIndicatorComponent,
    MessageUnmailedSeparatorComponent, MessagesLoadingIndicatorComponent, MessageScrollToEndButtonComponent,
    StaticClickDirective, LocaleSensitiveDirective, CustomScrollbarModule,
  ],
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnDestroy {
  protected _wrapper = viewChild<ElementRef<HTMLDivElement>>('wrapper');

  protected _list = viewChild('list', { read: NtListComponent });

  search = input<string>();

  scrollStartOffset = input<number>(0);

  scrollEndOffset = input<number>(0);

  isLazyLoading = signal<boolean>(false);

  searchedPattern = signal<Array<string>>([]);

  collection = signal<Array<IProxyCollectionItem<IMessageItemData>>>([]);
  protected $collection = toObservable(this.collection);

  scrollingSettings = SCROLLING_SETTINGS;

  theme: Signal<ITheme | undefined>;

  protected _proxyCollection = new ProxyCollection<IMessageItemData>([]);

  animationParams: INtListAnimationParams = { scrollToItem: 150, navigateToItem: 200, navigateByKeyboard: 50, snapToItem: 150 };

  collectionConfigMap = signal<IVirtualListItemConfigMap>({});

  selectedIds = signal<Array<Id> | Id>([]);

  isLoading = signal<boolean>(true);

  isListShowed: Signal<boolean | undefined>;

  defaultItemValue = signal<IVirtualListItem<IMessageItemData>>({
    dateTime: 0,
    mailed: false,
    text: '',
    edited: false,
    incomType: 'in',
    type: MessageTypes.MESSAGE,
    id: '-1',
  });

  scrollbarTheme: Signal<CustomScrollBarTheme>;

  private _$delete = new Subject<[IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, IRenderVirtualListItemConfig, ISize, boolean]>();
  protected $delete = this._$delete.asObservable();

  private _$edit = new Subject<{
    nativeEvent: Event, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, selected: boolean,
  }>();
  protected $edit = this._$edit.asObservable();

  private _$change = new Subject<{
    item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>,
    config: IDisplayObjectConfig,
    api: NtListPublicService,
    value: string | undefined
  }>();
  protected $change = this._$change.asObservable();

  private _$scroll = new Subject<IScrollEvent>();
  protected $scroll = this._$scroll.asObservable();

  private _$scrollReachStart = new Subject<void>();
  protected $scrollReachStart = this._$scrollReachStart.asObservable();

  private _messagesService = inject(MessagesService);

  private _messageNotificationService = inject(MessagesNotificationService);

  private _messageService = inject(MessageService);

  private _destroyRef = inject(DestroyRef);

  listClass: Signal<{ [className: string]: boolean }>;

  showScrollToBottom = signal<boolean>(false);

  private _chunkNumber = 1;

  private _$proxyCollectionChange = new Subject<void>();
  protected $proxyCollectionChange = this._$proxyCollectionChange.asObservable();

  private _proxyCollectionChangeHandler = () => {
    this._$proxyCollectionChange.next();
  };

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _themeService = inject(ThemeService);

  private _localizationService = inject(LocalizationService);

  readonly maxStaticClickDistance = 40;

  motionBlurEnabled = signal(true);

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

    const bp: Promise<EventTarget & { level: number, charging: boolean; }> | null = (navigator as any).getBattery?.() ?? null;
    if (!!bp) {
      bp.then(battery => {
        battery.addEventListener('levelchange', () => {
          this.motionBlurEnabled.set(battery.level >= 0.10 || battery.charging);
        });
        this.motionBlurEnabled.set(battery.level >= 0.10 || battery.charging);
      });
    }

    this.scrollbarTheme = computed(() => {
      const theme = this.theme();
      if (theme) {
        const preset = this._themeService.getPreset(SCROLLBAR_PRESET);
        if (preset) {
          return preset;
        }
      }
      return undefined;
    });

    let locale: string | undefined,
      localization: ILocalization | undefined;

    this._localizationService.$locale.pipe(
      takeUntilDestroyed(),
      tap(v => {
        locale = v;
      }),
    ).subscribe();

    this._localizationService.$localization.pipe(
      takeUntilDestroyed(),
      tap(v => {
        localization = v;
      }),
    ).subscribe();

    effect(() => {
      const theme = this.theme(), host = this._elementRef.nativeElement as HTMLDivElement;
      if (theme && host) {
        const preset = this._themeService.getPreset(theme.chat.messages);
        if (preset) {
          host.style.background = preset.background;
        }
      }
    });

    effect(() => {
      const theme = this.theme(), wrapper = this._wrapper()?.nativeElement;
      if (theme && wrapper) {
        const preset = this._themeService.getPreset(theme.chat.messages);
        if (preset) {
          wrapper.style.backgroundImage = preset.backgroundImage;
        }
      }
    });

    this.listClass = computed(() => {
      const loading = this.isLoading();
      return { loading };
    });

    this._proxyCollection.addEventListener(ProxyCollectionEvents.CHANGE, this._proxyCollectionChangeHandler);
    const $collection = toObservable(this.collection),
      $search = toObservable(this.search),
      $add = this._messageService.$add,
      $edit = this.$edit,
      $delete = this.$delete,
      $change = this.$change,
      $scroll = this.$scroll,
      $scrollReachStart = this.$scrollReachStart,
      $chatId = this._messageService.$chatId,
      $proxyCollectionChange = this.$proxyCollectionChange,
      $virtualList = toObservable(this._list).pipe(
        takeUntilDestroyed(),
        filter(list => !!list),
      );

    // protection against resetting a collection to a new one
    $proxyCollectionChange.pipe(
      takeUntilDestroyed(),
      switchMap(() => {
        const c = this._proxyCollection.toObject();
        if (c.length === 0) {
          return of(c);
        }
        return of(c).pipe(
          takeUntilDestroyed(this._destroyRef),
        );
      }),
      tap(c => {
        this.collection.set(c);
      }),
    ).subscribe();

    $virtualList.pipe(
      takeUntilDestroyed(),
      tap(list => {
        this._messageService.virtualList = list;
      }),
    ).subscribe();

    const $listPrepared = $virtualList.pipe(
      takeUntilDestroyed(),
      switchMap(list => {
        return list.$show;
      }),
    );

    this.isListShowed = toSignal($listPrepared);

    combineLatest([$virtualList, $chatId]).pipe(
      takeUntilDestroyed(),
      map(([list, chatId]) => ({ list, chatId })),
      filter(({ list, chatId }) => !!list && chatId !== null),
      tap(({ list }) => {
        // reset
        resourceManager.clear();
        this._chunkNumber = 1;
        this.isLoading.set(true);
        if (this._proxyCollection.collection.length > 0) {
          this._proxyCollection.from([]);
          this.selectedIds.set([]);
        }
      }),
    ).subscribe();

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(chatId => {
        return of(chatId).pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.isLoading.set(true);
          }),
          switchMap(chatId => {
            return this._messagesService.getMessages(chatId!, {
              number: this._chunkNumber,
              size: CHUNK_SIZE,
            }).pipe(
              takeUntilDestroyed(this._destroyRef),
              switchMap(v => of(createGroups(v, this._proxyCollection, locale!, localization!))),
            );
          }),
          catchError((err) => {
            return throwError(() => {
              return `Get message chunk error: ${err}`;
            });
          }),
          takeUntilDestroyed(this._destroyRef),
          switchMap(res => {
            const items = Array.isArray(res.items) ? res.items : [];
            validateCollection(items);

            this._proxyCollection.from(items, true);
            const configMap = {};
            fillConfigMap(configMap, this._proxyCollection.collection);
            this.collectionConfigMap.set(configMap);

            return of(items);
          }),
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this.isLoading.set(false);
          }),
          catchError((err) => {
            console.error(err);
            this.isLoading.set(false);
            return of(null);
          }),
        );
      }),
    ).subscribe();

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(() => {
        return $scroll.pipe(
          takeUntilDestroyed(this._destroyRef),
          filter(() => !this.isLoading()),
          debounceTime(10),
          takeUntilDestroyed(this._destroyRef),
          filter(e => !!e),
          tap(e => {
            this.showScrollToBottom.set(!e.isEnd);
          }),
        );
      }),
    ).subscribe();

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(chatId => {
        return $scroll.pipe(
          takeUntilDestroyed(this._destroyRef),
          filter(() => !this.isLoading()),
          debounceTime(500),
          takeUntilDestroyed(this._destroyRef),
          switchMap(e => {
            const messages: IVirtualListCollection<IVirtualListItem<IMessageItemData>> = [],
              notFiltered: IVirtualListCollection<IVirtualListItem<IMessageItemData>> = [], range = e.itemsRange;
            if (range) {
              const collection = this._proxyCollection.collection;
              for (let i = range[0], l = range[1]; i < l; i++) {
                const proxyItem = collection[i], msg = proxyItem?.data;
                if (msg) {
                  if (!msg.mailed) {
                    messages.push({ ...msg, mailed: true });
                  }
                  notFiltered.push(msg);
                }
              }
            }
            if (messages.length > 0) {
              return this._messagesService.patchMessages(chatId, messages).pipe(
                takeUntilDestroyed(this._destroyRef),
                switchMap(v => of(createGroups(v, this._proxyCollection, locale!, localization!))),
              );
            }
            createGroups({ version: 0, items: notFiltered as any, }, this._proxyCollection, locale!, localization!);
            return of({ version: 0, items: [] });
          }),
          catchError((err) => {
            return throwError(() => {
              return `Patch messages error: ${err}`;
            });
          }),
          filter(res => !!res && res.items.length > 0),
          tap(res => {
            const items = Array.isArray(res.items) ? res.items : [];
            validateCollection(items);

            this._proxyCollection.from(items, true);
            const configMap = {};
            fillConfigMap(configMap, this._proxyCollection.collection);
            this.collectionConfigMap.set(configMap);
          }),
          catchError((err) => {
            this.isLazyLoading.set(false);
            console.error(err);
            return of(null);
          }),
        );
      }),
    ).subscribe();

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(chatId => {
        return $scrollReachStart.pipe(
          takeUntilDestroyed(this._destroyRef),
          filter(() => !this.isLoading()),
          switchMap(() => {
            this.isLazyLoading.set(true);
            return this._messagesService.getMessages(chatId, {
              number: this._chunkNumber + 1,
              size: CHUNK_SIZE,
            }).pipe(
              takeUntilDestroyed(this._destroyRef),
              switchMap(v => of(createGroups(v, this._proxyCollection, locale!, localization!))),
            );
          }),
          catchError((err) => {
            return throwError(() => {
              return `Get message chunk error: ${err}`;
            });
          }),
          tap(res => {
            this.isLazyLoading.set(false);
            const items = Array.isArray(res.items) ? res.items : [];
            this._chunkNumber++;
            validateCollection(items);

            this._proxyCollection.from(items, true);
            const configMap = {};
            fillConfigMap(configMap, this._proxyCollection.collection);
            this.collectionConfigMap.set(configMap);
          }),
          catchError((err) => {
            this.isLazyLoading.set(false);
            console.error(err);
            return of(null);
          }),
        );
      }),
    ).subscribe();

    $add.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      tap(msg => {
        validateMessage(msg);
        this._proxyCollection.set(msg.id, msg as CollectionItem<IMessageItemData>);
        const configMap = {};
        fillConfigMap(configMap, this._proxyCollection.collection);
        this.collectionConfigMap.set(configMap);
      }),
      delay(50),
      tap(() => {
        this.onScrollToEndClickHandler();
      }),
    ).subscribe();

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(chatId => {
        return this._messageNotificationService.$messages.pipe(
          takeUntilDestroyed(this._destroyRef),
          switchMap(version => {
            return this._messagesService.getMessages(chatId).pipe(
              takeUntilDestroyed(this._destroyRef),
              switchMap(v => of(createGroups(v, this._proxyCollection, locale!, localization!))),
            );
          }),
        );
      }),
      catchError((err) => {
        return throwError(() => {
          return `Get message chunk error: ${err}`;
        });
      }),
      tap(res => {
        const items = Array.isArray(res.items) ? res.items : [];
        validateCollection(items);
        this._proxyCollection.from(items, true);
        const configMap = {};
        fillConfigMap(configMap, this._proxyCollection.collection);
        this.collectionConfigMap.set(configMap);
      }),
      catchError((err) => {
        console.error(err);
        return of(null);
      }),
    ).subscribe();

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(chatId => {
        return this._messageNotificationService.$typing.pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            if (this._proxyCollection.has(TYPING_INDICATOR_INDEX)) {
              const indicator = this._proxyCollection.get(TYPING_INDICATOR_INDEX);
              this._proxyCollection.setParams(indicator.id, { deleted: false, animate: false });
              const configMap = { ...this.collectionConfigMap() };
              configMap[indicator.id] = {
                sticky: 0,
                collapsable: false,
                selectable: false,
              };
              this.collectionConfigMap.set(configMap);
              return;
            }
            const indicator = generateTypingIndicator();
            this._proxyCollection.set(indicator.item.id, indicator.item);
            const configMap = { ...this.collectionConfigMap() };
            configMap[indicator.item.id] = indicator.config;
            this.collectionConfigMap.set(configMap);
          }),
        );
      }),
    ).subscribe();

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(chatId => {
        return this._messageNotificationService.$messages.pipe(
          takeUntilDestroyed(this._destroyRef),
          switchMap(() => {
            return this.deleteTypingIndicator(chatId).pipe(
              takeUntilDestroyed(this._destroyRef),
            );
          }),
        );
      }),
    ).subscribe();

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(chatId => {
        return $delete.pipe(
          takeUntilDestroyed(this._destroyRef),
          switchMap(([item, config, measures, deleteAll]) => {
            this._proxyCollection.setParams(item.id, { removal: true, });
            const id = item.id;
            return this._messagesService.deleteMessage(chatId, id, { deleteAll }).pipe(
              takeUntilDestroyed(this._destroyRef),
              catchError((err) => {
                this._proxyCollection.setParams(item.id, { removal: false, });
                console.error(`Delete message error: ${err}`);
                return of();
              }),
              switchMap(version => {
                this._proxyCollection.setParams(item.id, { version, });
                return of({ item, config, measures }).pipe(
                  takeUntilDestroyed(this._destroyRef),
                );
              }),
            );
          }),
          tap(({ item, measures }) => {
            if (this._proxyCollection.has(item.id)) {
              document.documentElement.style.setProperty(ROOT_VAR_DELETED_ITEM_HEIGHT, `${measures.height - MIN_ITEM_HEIGHT}px`);
              this._proxyCollection.setParams(item.id, { animate: true, deleting: false, });
            }
          }),
          delay(0),
          takeUntilDestroyed(this._destroyRef),
          tap(({ item }) => {
            this._proxyCollection.setParams(item.id, { deleted: true, });
          }),
          delay(150),
          takeUntilDestroyed(this._destroyRef),
          tap(({ item }) => {
            this._proxyCollection.delete(item.id);
          }),
          catchError((e) => {
            console.error(e)
            return of();
          }),
        );
      }),
    ).subscribe();

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(chatId => {
        return $edit.pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(({ item, selected }) => {
            this._messageService.stopSnappingScrollToEnd();

            this._proxyCollection.setParams(item.id, { edited: selected === true, });
          }),
        );
      }),
    ).subscribe();

    $chatId.pipe(
      takeUntilDestroyed(),
      filter(v => v !== null),
      switchMap(chatId => {
        return $change.pipe(
          takeUntilDestroyed(this._destroyRef),
          tap(() => {
            this._messageService.stopSnappingScrollToEnd();
          }),
          switchMap(({ item, api, config, value }) => {
            this._proxyCollection.setParams(item.id, { processing: true, });
            const id = item.id;
            return this._messagesService.updateMessage(chatId, id, {
              text: value,
            }).pipe(
              takeUntilDestroyed(this._destroyRef),
              filter(v => !!v),
              tap(updatedItem => {
                this._proxyCollection.set(item.id, updatedItem, { processing: false, edited: false, });
                api?.select(item.id, false);
              }),
              catchError((err) => {
                this._proxyCollection.setParams(item.id, { processing: false, });
                console.error(`Delete message error: ${err}`);
                return of(null);
              }),
            );
          }),
        );
      }),
    ).subscribe();

    combineLatest([$virtualList, $collection, $search]).pipe(
      takeUntilDestroyed(),
      map(([list, collection, search]) => ({ list, collection, search: search ?? '' })),
      filter(({ list }) => !!list),
      debounceTime(250),
      takeUntilDestroyed(this._destroyRef),
      tap(({ search }) => {
        this.searchedPattern.set(search.split?.(' ') ?? []);
      }),
      filter(({ search }) => search !== ''),
      switchMap(({ list, collection, search }) => {
        for (let i = 0, l = collection.length; i < l; i++) {
          const item = collection[i], name: string = item.data?.text;
          if (name) {
            const index = name?.indexOf(search);
            if (index > -1) {
              const id = item.id;
              return of(({ id, list }));
            }
          }
        }
        return of({ id: null, list: undefined });
      }),
      takeUntilDestroyed(this._destroyRef),
      tap(({ id, list }) => {
        if (id !== null && list) {
          list!.scrollTo(id, null, { focused: false });
        }
      }),
      debounceTime(2000),
      takeUntilDestroyed(this._destroyRef),
      tap(({ id, list }) => {
        if (id !== null && list) {
          list.focus(id, FocusAlignments.NONE);
        }
      }),
    ).subscribe();
  }

  private deleteTypingIndicator(chatId: Id) {
    return of(chatId).pipe(
      takeUntilDestroyed(this._destroyRef),
      tap(() => {
        const collection = this.collection();
        let newItems = [...collection], config = { ...this.collectionConfigMap() };
        if (newItems.length) {
          let i = 0, hasItem = false;
          while (i < newItems.length) {
            i++;
            const index = newItems.length - i, item = newItems[index];
            if (item?.data?.type === MessageTypes.TYPING_INDICATOR) {
              this._proxyCollection.setParams(item.id, { animate: true, });
              hasItem = true;
            } else if (hasItem) {
              break;
            }
          }
        }
        this.collectionConfigMap.set(config);
      }),
      delay(1),
      takeUntilDestroyed(this._destroyRef),
      tap(() => {
        const collection = this.collection();
        let newItems = [...collection], config = { ...this.collectionConfigMap() };
        if (newItems.length) {
          let i = 0, hasItem = false;
          while (i < newItems.length) {
            i++;
            const index = newItems.length - i, item = newItems[index];
            if (item?.data?.type === MessageTypes.TYPING_INDICATOR) {
              this._proxyCollection.setParams(item.id, { deleted: true, });
              hasItem = true;
            } else if (hasItem) {
              break;
            }
          }
        }
        this.collectionConfigMap.set(config);
      }),
      delay(1),
      takeUntilDestroyed(this._destroyRef),
      tap(() => {
        const collection = this.collection();
        let newItems = [...collection], config = { ...this.collectionConfigMap() };
        if (newItems.length) {
          let i = 0, hasItem = false;
          while (i < newItems.length) {
            i++;
            const index = newItems.length - i, item = newItems[index];
            if (item?.data?.type === MessageTypes.TYPING_INDICATOR) {
              this._proxyCollection.delete(item.id);
              newItems.pop();
              delete config[item.id];
              hasItem = true;
            } else if (hasItem) {
              break;
            }
          }
        }
        this.collectionConfigMap.set(config);
      }),
    );
  }

  hide() {
    this.isLoading.set(true);
  }

  onEditItemHandler(e:
    {
      nativeEvent: Event, item: IVirtualListItem<IProxyCollectionItem<IMessageItemData>>, selected: boolean,
    }) {
    this._$edit.next(e);
  }

  onChangeItemHandler(api: any, { item, config, value }: any) {
    this._$change.next({ item, api, config, value });
  }

  onChangeMessageHandler(e: any) {
    this._messageService.stopSnappingScrollToEnd();
  }

  onDeleteItemHandler({ data, componentData }:
    {
      data: IDeleteEventData | undefined;
      componentData: boolean;
    }, index: number) {
    if (data && data.item) {
      this._$delete.next([data.item, data.config, data.measures, componentData]);
    }
  }

  onScrollReachStartHandler() {
    this._$scrollReachStart.next(undefined);
  }

  onSelectItemHandler(ids: Array<Id> | Id | null) {
    this.selectedIds.set(Array.isArray(ids) ? ids : []);
  }

  onEditingCancelHandler(item: IVirtualListItem<IMessageItemData>) {
    this._proxyCollection.setParams(item.id, { edited: false, });
  }

  onScrollHandler(e: IScrollEvent) {
    this._$scroll.next(e);
  }

  onScrollToEndClickHandler() {
    const list = this._list();
    if (list) {
      list.scrollToEnd();
    }
  }

  onQuoteSelectHandler(id: Id | null) {
    const list = this._list();
    if (list && id !== null) {
      list.scrollTo(id);
    }
  }

  ngOnDestroy(): void {
    if (this._proxyCollection) {
      this._proxyCollection.dispose();
    }
  }
}
