import { CommonModule } from '@angular/common';
import {
  Component, CUSTOM_ELEMENTS_SCHEMA, signal, ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ClickOutsideService } from '@shared/directives';
import { GalleryComponent } from "@widgets/gallery/gallery/gallery.component";
import { generateChatCollection } from '@mock/const';
import { ReaderService } from '@widgets/gallery/reader.service';
import { ReaderMockService } from '@widgets/gallery/reader-mock.service';
import { ReaderHttpService } from '@widgets/gallery/reader-http.service';
import { environment } from '@environments/environment';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-gallery-page',
  standalone: true,
  imports: [CommonModule, FormsModule, GalleryComponent],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ClickOutsideService,
    { provide: ReaderService, useClass: environment.useMock ? ReaderMockService : ReaderHttpService },
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class GalleryPageComponent {
  private _$version = new BehaviorSubject<number>(0);
  readonly $version = this._$version.asObservable();

  show = signal(true);

  search = signal('');

  items = generateChatCollection();

  title = signal<string | undefined>('Photo Gallery');

  constructor() { }

  onSearchHandler(pattern: any) {
    this.search.set(pattern);
  }
}
