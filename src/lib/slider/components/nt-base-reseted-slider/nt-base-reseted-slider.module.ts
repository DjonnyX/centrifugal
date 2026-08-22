import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtBaseResetedSliderComponent } from './nt-base-reseted-slider.component';
import { NtBaseSliderModule } from '../nt-base-slider/nt-base-slider.module';

@NgModule({
  declarations: [NtBaseResetedSliderComponent],
  exports: [NtBaseResetedSliderComponent],
  imports: [CommonModule, NtBaseSliderModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtBaseResetedSliderModule { }
