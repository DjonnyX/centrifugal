import { Component, input, output, TemplateRef } from "@angular/core";
import { IOverscrollEvent, ISize } from "../../../common";

/**
 * NtOverscrollIndicatorComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/scroll-view/components/nt-overscroll-indicator-container/nt-overscroll-indicator-container.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-overscroll-indicator-container',
    templateUrl: './nt-overscroll-indicator-container.component.html',
    styleUrl: './nt-overscroll-indicator-container.component.scss',
    host: {
        'style': `
            position: relative;
            width: 100%;
            height: 100%;
            display: block;
            pointer-events: none;
        `
    },
    standalone: false,
})
export class NtOverscrollIndicatorContainerComponent {
    readonly onLeftIndiatorTrigger = output<boolean>();

    readonly onTopIndiatorTrigger = output<boolean>();

    readonly onRightIndiatorTrigger = output<boolean>();

    readonly onBottomIndiatorTrigger = output<boolean>();

    readonly bounds = input<ISize>({ width: 0, height: 0 });

    readonly overscrollEvent = input<IOverscrollEvent | null>(null);

    readonly leftOffset = input<number>(0);

    readonly topOffset = input<number>(0);

    readonly rightOffset = input<number>(0);

    readonly bottomOffset = input<number>(0);

    readonly leftIndicatorEnabled = input<boolean>(false);

    readonly topIndicatorEnabled = input<boolean>(false);

    readonly rightIndicatorEnabled = input<boolean>(false);

    readonly bottomIndicatorEnabled = input<boolean>(false);

    readonly leftIndicatorRenderer = input<TemplateRef<any> | null>(null);

    readonly topIndicatorRenderer = input<TemplateRef<any> | null>(null);

    readonly rightIndicatorRenderer = input<TemplateRef<any> | null>(null);

    readonly bottomIndicatorRenderer = input<TemplateRef<any> | null>(null);
}