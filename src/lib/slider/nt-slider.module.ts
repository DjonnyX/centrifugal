import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtSliderComponent } from './nt-slider.component';
import { NtBaseResetedSliderModule } from './components/nt-base-reseted-slider';

@NgModule({
  declarations: [NtSliderComponent],
  exports: [NtSliderComponent],
  imports: [CommonModule, NtBaseResetedSliderModule],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtSliderModule { }
