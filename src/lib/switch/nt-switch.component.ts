import { Component, computed, input, output, Signal, viewChild } from "@angular/core";
import { SCROLL_VIEW_INVERSION, SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO, SCROLL_VIEW_TYPE } from "../common";
import { ScrollerTypes } from "../common/enums/scroller-types";
import { NtSliderComponent } from "../slider";
import { validateBoolean } from "../common/utils";
import { NtScrollerComponent } from "../list/components/nt-scroller/nt-scroller.component";

/**
 * NtSwitchComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/switch/nt-switch.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
    selector: 'nt-switch',
    providers: [
        { provide: SCROLL_VIEW_TYPE, useValue: ScrollerTypes.SCROLL_VIEW_SWITCH },
        { provide: SCROLL_VIEW_INVERSION, useValue: false },
        { provide: SCROLL_VIEW_NORMALIZE_VALUE_FROM_ZERO, useValue: true },
    ],
    standalone: false,
    templateUrl: './nt-switch.component.html',
    styleUrl: './nt-switch.component.scss'
})
export class NtSwitchComponent extends NtScrollerComponent {
    readonly slider = viewChild<NtSliderComponent>('slider');

    /**
     * Triggers an event when the value changes.
     */
    readonly onChange = output<boolean>();

    protected _valueOptions = {
        transform: (v: boolean) => {
            const valid = validateBoolean(v);
            if (!valid) {
                console.error('The "value" parameter must be of type `boolean`.');
                return false;
            }
            return v;
        },
    } as any;

    /**
     * Switch value. Default value is `false`.
     */
    value = input<boolean>(false, { ...this._valueOptions });

    protected _sliderValue: Signal<number>;

    constructor() {
        super();

        this._sliderValue = computed(() => {
            return this.value() === true ? 1 : 0;
        });
    }

    protected onChangeHandler(value: number) {
        this.onChange.emit(value === 1);
    }
}