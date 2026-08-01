import { Component, input, output, signal, TemplateRef } from "@angular/core";
import { IOverscrollEvent } from "../../../common";

/**
 * NtOverscrollIndicatorComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-overscroll-indicator-container.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-overscroll-indicator-container',
    templateUrl: './nt-overscroll-indicator-container.component.html',
    styleUrl: './nt-overscroll-indicator-container.component.scss',
    host: {
        'style': 'position: relative;'
    },
    standalone: false,
})
export class NtOverscrollIndicatorContainerComponent {
    readonly onLeftIndiatorPinned = output<boolean>();

    readonly onTopIndiatorPinned = output<boolean>();

    readonly onRightIndiatorPinned = output<boolean>();

    readonly onBottomIndiatorPinned = output<boolean>();

    readonly overscrollEvent = input<IOverscrollEvent | null>(null);

    readonly leftIndicatorEnabled = input<boolean>(false);

    readonly topIndicatorEnabled = input<boolean>(false);

    readonly rightIndicatorEnabled = input<boolean>(false);

    readonly bottomIndicatorEnabled = input<boolean>(false);

    readonly leftIndicatorRenderer = input<TemplateRef<any> | null>(null);

    readonly topIndicatorRenderer = input<TemplateRef<any> | null>(null);

    readonly rightIndicatorRenderer = input<TemplateRef<any> | null>(null);

    readonly bottomIndicatorRenderer = input<TemplateRef<any> | null>(null);

    readonly leftIndicatorPinned = signal<boolean>(false);

    readonly topIndicatorPinned = signal<boolean>(false);

    readonly rightIndicatorPinned = signal<boolean>(false);

    readonly bottomIndicatorPinned = signal<boolean>(false);
}