import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NtScrollerComponent } from './nt-scroller.component';
import { NtLocaleSensitiveModule, NtControlModule } from '../../../common';
import { NtBaseScrollBarModule } from '../../../scroll-bar/components/nt-base-scroll-bar/nt-base-scroll-bar.module';
import { NtOverscrollContainerModule } from '../nt-overscroll/nt-overscroll-container.module';

@NgModule({
  declarations: [NtScrollerComponent],
  exports: [NtScrollerComponent],
  imports: [
    CommonModule, NtBaseScrollBarModule, NtOverscrollContainerModule, NtLocaleSensitiveModule, NtControlModule,
    CdkScrollableModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtScrollerModule { }
