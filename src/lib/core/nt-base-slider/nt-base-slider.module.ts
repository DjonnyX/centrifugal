import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtBaseSliderComponent } from './nt-base-slider.component';
import { NtOverscrollContainerModule } from '../nt-overscroll-container/nt-overscroll-container.module';
import { NtControlModule } from '../../common';

@NgModule({
  declarations: [NtBaseSliderComponent],
  exports: [NtBaseSliderComponent],
  imports: [CommonModule, NtControlModule, NtOverscrollContainerModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtBaseSliderModule { }
