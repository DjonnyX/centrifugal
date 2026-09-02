import { CommonModule } from '@angular/common';
import {
  Component, computed, effect, ElementRef, inject, input, Signal, viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IDisplayObjectConfig, IDisplayObjectMeasures, IVirtualListItem, NtListPublicService } from 'centrifugal';
import { ISwipeImageData } from "@shared/models/images";
import { GradientColor } from '@shared/types';
import { ThemeService } from '@shared/theming';
import { ITheme } from '@shared/theming';
import { IProxyCollectionItem } from '@widgets/swipe-image/swipe-image/utils/proxy-collection';
import { IPageParams } from './interfaces/page-params';

const DEFAULT_MAX_DISTANCE = 40;

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-image',
  imports: [CommonModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
  host: {
    'class': 'image',
  },
  encapsulation: ViewEncapsulation.Emulated,
})
export class ImageComponent {
  api = input<NtListPublicService>();

  data = input<IVirtualListItem<IProxyCollectionItem<ISwipeImageData>> | null>(null);

  config = input<IDisplayObjectConfig | null>(null);

  measures = input<IDisplayObjectMeasures | null>(null);

  params = input.required<IPageParams>();

  searchPattern = input<Array<string>>([]);

  classes = input.required<{ [className: string]: boolean; }>();

  width: Signal<number>;

  height: Signal<number>;

  theme: Signal<ITheme | undefined>;

  private _elementRef = inject(ElementRef<HTMLDivElement>);

  private _themeService = inject(ThemeService);

  readonly maxStaticClickDistance = DEFAULT_MAX_DISTANCE;

  someCondition = true;

  constructor() {
    this.theme = toSignal(this._themeService.$theme);

    this.width = computed(() => {
      const w = (this.measures()?.width ?? 0);
      return w;
    });

    this.height = computed(() => {
      const h = (this.measures()?.height ?? 0);
      return h;
    });

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
  }
}
