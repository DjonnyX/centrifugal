import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, input, output, Signal, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, filter, of, switchMap, tap, throwError } from 'rxjs';
import { GroupsLoadingIndicatorComponent } from '@entities/groups';
import { NtListModule, NtListComponent, Id, IVirtualListCollection, IVirtualListItem } from 'centrifugal';
import { environment } from '@environments/environment';
import { GroupsService } from '../groups.service';
import { GroupsMockService } from '../groups-mock.service';
import { GroupsWebsocketService } from '../groups-websocket.service';
import { validateCollection } from './utils/validate-collection';
import { ClickOutsideDirective, StaticClickDirective } from '@shared/directives';
import { ITheme, ThemeService } from '@shared/theming';
import { GroupComponent } from './group/group.component';
import { CustomScrollbarModule } from '@shared/components/custom-scrollbar/custom-scrollbar.module';
import { CustomScrollBarTheme } from '@shared/components/custom-scrollbar/interfaces/custom-scrollbar-theme';

const DEFAULT_MAX_DISTANCE = 40,
  MENU_BUTTON_NAME = 'menu-button',
  SCROLLBAR_PRESET = 'x-scrollbar-secondary';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-groups',
  imports: [
    CommonModule, NtListModule, GroupsLoadingIndicatorComponent, ClickOutsideDirective, StaticClickDirective, GroupComponent,
    CustomScrollbarModule,
  ],
  providers: [
    { provide: GroupsService, useClass: environment.useMock ? GroupsMockService : GroupsWebsocketService },
  ],
  standalone: true,
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent {
  protected _list = viewChild('list', { read: NtListComponent });

  projectId = input<string>('');

  scrollStartOffset = input<number>(0);

  select = output<IVirtualListItem>();

  close = output<void>();

  collection = signal<IVirtualListCollection<any>>([]);

  isLoading = signal<boolean>(true);

  selectedId = signal<Id>(-1);

  readonly maxStaticClickDistance = DEFAULT_MAX_DISTANCE;

  focused = signal<boolean>(false);

  scrollbarTheme: Signal<CustomScrollBarTheme>;

  private _service = inject(GroupsService);

  theme: Signal<ITheme | undefined>;

  private _themeService = inject(ThemeService);

  private _elementRef = inject(ElementRef);

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

    this.scrollbarTheme = computed(() => {
      const theme = this.theme();
      if (!!theme) {
        const preset = this._themeService.getPreset(SCROLLBAR_PRESET);
        if (!!preset) {
          return preset;
        }
      }
      return undefined;
    });

    effect(() => {
      const collection = this.collection();
      if (collection.length) {
        for (let i = 0, l = collection.length; i < l; i++) {
          const item = collection[0];
          if (item) {
            this.select.emit(item);
            this.selectedId.set(item.id ?? null);
          }
          break;
        }
      }
    });

    effect(() => {
      const theme = this.theme();
      if (!!theme) {
        const preset = this._themeService.getPreset(theme.fileViewer.groups.group);
        if (!!preset) {
          const host = this._elementRef?.nativeElement;
          if (host) {
            host.style.backgroundColor = preset.background;
          }
        }
      }
    });

    const $projectId = toObservable(this.projectId).pipe(
      filter(v => v !== undefined),
    );

    $projectId.pipe(
      takeUntilDestroyed(),
      tap(() => {
        const collection = this.collection();
        if (!collection.length) {
          this.isLoading.set(true);
        }
      }),
      switchMap(groupId => {
        return this._service.getGroups(groupId);
      }),
      catchError((err) => {
        return throwError(() => {
          return `Get group chunk error: ${err}`;
        });
      }),
      tap(items => {
        validateCollection(items);

        // const current = this.collection(),
        //   collection = appendItems(current, items);

        // fillConfigMap(this.collectionConfigMap(), items);

        this.collection.set(items);
      }),
      tap(() => {
        this.isLoading.set(false);
      }),
      catchError((err) => {
        console.error(err);
        this.isLoading.set(false);
        return of(undefined);
      }),
    ).subscribe();
  }

  onGroupClickHandler(item: IVirtualListItem<any>) {
    if (!!item) {
      this.select.emit(item);
    }
    this.close.emit();
  }

  onClickOutside(e: Event) {
    if ((e.target as HTMLElement).getAttribute('name') === MENU_BUTTON_NAME) {
      return;
    }
    this.close.emit();
  }

  onClickHandler(e: Event) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}
