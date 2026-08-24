import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtBaseResetedSliderComponent } from './nt-base-reseted-slider.component';
import { NtBaseSliderModule } from '../../../core/nt-base-slider';
import { NtOverscrollContainerModule } from '../../../core/nt-overscroll-container/nt-overscroll-container.module';

@NgModule({
  declarations: [NtBaseResetedSliderComponent],
  exports: [NtBaseResetedSliderComponent],
  imports: [CommonModule, NtBaseSliderModule, NtOverscrollContainerModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtBaseResetedSliderModule { }
