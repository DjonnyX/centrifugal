import { CommonModule } from '@angular/common';
import {
  Component, CUSTOM_ELEMENTS_SCHEMA, signal, ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, } from 'rxjs';
import { ClickOutsideService } from '@shared/directives';
import { PaintingCanvasPageComponent } from "@widgets/painting-canvas/painting-canvas/painting-canvas.component";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Component({
  selector: 'x-painting-canvas-page',
  standalone: true,
  imports: [CommonModule, PaintingCanvasPageComponent],
  templateUrl: './painting-canvas.component.html',
  styleUrl: './painting-canvas.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ClickOutsideService],
  encapsulation: ViewEncapsulation.Emulated,
})
export class PaintingCanvas {
  private _$version = new BehaviorSubject<number>(0);
  readonly $version = this._$version.asObservable();

  show = signal(true);

  constructor() { }
}
