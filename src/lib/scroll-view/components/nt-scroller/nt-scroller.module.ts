import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NtScrollerComponent } from './nt-scroller.component';
import { NtLocaleSensitiveModule, NtVirtualClickModule } from '../../../common';
import { NtBaseScrollBarModule } from '../../../scroll-bar/components/nt-base-scroll-bar/nt-base-scroll-bar.module';
import { NtOverscrollIndicatorContainerModule } from '../nt-overscroll/nt-overscroll-indicator-container.module';

@NgModule({
  declarations: [NtScrollerComponent],
  exports: [NtScrollerComponent],
  imports: [
    CommonModule, NtBaseScrollBarModule, NtOverscrollIndicatorContainerModule, NtLocaleSensitiveModule, NtVirtualClickModule,
    CdkScrollableModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtScrollerModule { }
