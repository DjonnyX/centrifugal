import { Component, ViewEncapsulation } from "@angular/core";
import { SCROLL_VIEW_TYPE } from "../common";

/**
 * NtSliderComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/slider/nt-slider.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
  selector: 'nt-scroll-bar',
  templateUrl: './nt-scroll-bar.component.html',
  styleUrl: './nt-scroll-bar.component.scss',
  host: {
    'style': 'position: relative;'
  },
  standalone: false,
  encapsulation: ViewEncapsulation.ShadowDom,
  providers: [
    { provide: SCROLL_VIEW_TYPE, useValue: 'scrollbar' },
  ],
})
export class NtSliderComponent {

}