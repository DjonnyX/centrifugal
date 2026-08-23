import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtBaseResetedSliderComponent } from './nt-base-reseted-slider.component';
import { NtBaseSliderModule } from '../../../core/nt-base-slider';

@NgModule({
  declarations: [NtBaseResetedSliderComponent],
  exports: [NtBaseResetedSliderComponent],
  imports: [CommonModule, NtBaseSliderModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtBaseResetedSliderModule { }
