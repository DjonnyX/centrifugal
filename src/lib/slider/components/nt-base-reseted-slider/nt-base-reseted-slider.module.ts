import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtBaseResetedSliderComponent } from './nt-base-reseted-slider.component';

@NgModule({
  declarations: [NtBaseResetedSliderComponent],
  exports: [NtBaseResetedSliderComponent],
  imports: [CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtBaseResetedSliderModule { }
