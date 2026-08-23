import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtSScrollerComponent } from './nt-s-scroller.component';
import { NtLocaleSensitiveModule, NtControlModule } from '../../common/directives';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NtBaseSliderModule } from '../nt-base-slider';
import { NtOverscrollContainerModule } from '../nt-overscroll-container/nt-overscroll-container.module.js';

@NgModule({
  declarations: [NtSScrollerComponent],
  exports: [NtSScrollerComponent],
  imports: [CommonModule, NtBaseSliderModule, NtOverscrollContainerModule, NtLocaleSensitiveModule, NtControlModule, CdkScrollableModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtSScrollerModule { }
