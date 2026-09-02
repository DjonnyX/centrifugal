import { CommonModule } from '@angular/common';
import {
  Component, CUSTOM_ELEMENTS_SCHEMA, signal, ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, } from 'rxjs';
import { ClickOutsideService } from '@shared/directives';
import { SwipeImageComponent } from "@widgets/swipe-image/swipe-image/swipe-image.component";
import { generateChatCollection } from '@mock/const';
import { SwipeImageService } from '@widgets/swipe-image/swipe-image.service';
import { SwipeImageMockService } from '@widgets/swipe-image/swipe-image-mock.service';
import { SwipeImageHttpService } from '@widgets/swipe-image/swipe-image-http.service';
import { environment } from '@environments/environment';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-swipe-image-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SwipeImageComponent],
  templateUrl: './swipe-image.component.html',
  styleUrl: './swipe-image.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ClickOutsideService,
    { provide: SwipeImageService, useClass: environment.useMock ? SwipeImageMockService : SwipeImageHttpService },
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SwipeImage {
  private _$version = new BehaviorSubject<number>(0);
  readonly $version = this._$version.asObservable();

  show = signal(true);

  items = generateChatCollection();

  constructor() { }
}
