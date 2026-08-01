import { Component, input, output, TemplateRef } from "@angular/core";
import { IOverscrollEvent } from "../../../common";

/**
 * NtOverscrollIndicatorComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-overscroll-indicator.component.ts
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
export class NtOverscrollIndicatorComponent {
    readonly onPinned = output<boolean>();

    readonly renderer = input<TemplateRef<any> | null>(null);

    readonly overscrollEvent = input<IOverscrollEvent | null>(null);
}