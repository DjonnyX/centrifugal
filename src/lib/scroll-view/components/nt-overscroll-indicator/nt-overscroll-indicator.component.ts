import { Component } from "@angular/core";
import { NtBaseOverscrollIndicatorComponent } from "./base";

/**
 * NtOverscrollIndicatorComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-overscroll-indicator/nt-overscroll-indicator.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-overscroll-indicator',
    templateUrl: './nt-overscroll-indicator.component.html',
    styleUrl: './nt-overscroll-indicator.component.scss',
    host: {
        'style': 'position: relative;'
    },
    standalone: false,
})
export class NtOverscrollIndicatorComponent extends NtBaseOverscrollIndicatorComponent {

}