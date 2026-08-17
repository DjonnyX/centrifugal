import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtScrollerModule } from '../scroll-view';
import { NtLocaleSensitiveModule } from '../common';
import { NtDrawerContainerModule } from '../drawer-container';
import { NtSliderComponent } from './nt-slider.component';

@NgModule({
  declarations: [NtSliderComponent],
  exports: [NtSliderComponent],
  imports: [CommonModule, NtDrawerContainerModule, NtScrollerModule, NtLocaleSensitiveModule],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtControlContainerModule { }
