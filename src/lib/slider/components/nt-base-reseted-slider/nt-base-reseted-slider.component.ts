import { Component } from '@angular/core';
import { NtBaseSliderComponent } from '../../../core/nt-base-slider';

/**
 * NtBaseResetedSliderComponent
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/slider/components/nt-base-reseted-slider/nt-base-reseted-slider.component.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
@Component({
  selector: 'nt-base-reseted-slider',
  standalone: false,
  templateUrl: '../../../core/nt-base-slider/nt-base-slider.component.html',
  styleUrl: '../../../core/nt-base-slider/nt-base-slider.component.scss'
})
export class NtBaseResetedSliderComponent extends NtBaseSliderComponent { }
