import { Component, ViewEncapsulation } from "@angular/core";

/**
 * NtScrollBarComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-bar/nt-scroll-bar.component.ts
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
  providers: [],
})
export class NtScrollBarComponent {

}