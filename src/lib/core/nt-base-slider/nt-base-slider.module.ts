import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtBaseSliderComponent } from './nt-base-slider.component';

@NgModule({
  declarations: [NtBaseSliderComponent],
  exports: [NtBaseSliderComponent],
  imports: [CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtBaseSliderModule { }
