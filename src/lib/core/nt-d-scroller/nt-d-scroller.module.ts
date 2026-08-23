import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NtLocaleSensitiveModule, NtControlModule } from '../../common';
import { NtDScrollerComponent } from './nt-d-scroller.component';
import { NtBaseSliderModule } from '../nt-base-slider/nt-base-slider.module';
import { NtOverscrollContainerModule } from '../nt-overscroll-container/nt-overscroll-container.module';

@NgModule({
  declarations: [NtDScrollerComponent],
  exports: [NtDScrollerComponent],
  imports: [
    CommonModule, NtBaseSliderModule, NtOverscrollContainerModule, NtLocaleSensitiveModule, NtControlModule,
    CdkScrollableModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtDScrollerModule { }
