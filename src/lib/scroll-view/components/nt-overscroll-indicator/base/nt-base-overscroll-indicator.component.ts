import { Component, input, output, TemplateRef } from "@angular/core";
import { IOverscrollEvent } from "../../../../common";

/**
 * NtOverscrollIndicatorComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-overscroll-indicator/base/nt-base-overscroll-indicator.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-base-overscroll-indicator',
    template: './nt-base-overscroll-indicator.component.html',
    standalone: false,
})
export class NtBaseOverscrollIndicatorComponent {
    readonly onPinned = output<boolean>();

    readonly renderer = input<TemplateRef<any> | null>(null);

    readonly overscrollEvent = input<IOverscrollEvent | null>(null);
}