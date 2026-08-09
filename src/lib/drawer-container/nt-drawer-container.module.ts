import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtScrollerModule, NtScrollViewModule } from '../scroll-view';
import { NtDrawerContainerComponent } from './nt-drawer-container.component';
import { NtLocaleSensitiveModule, NtControlModule } from '../common';
import { NtDrawerLayoutModule } from './layouts/nt-drawer-layout/nt-drawer-layout.module';

@NgModule({
  declarations: [NtDrawerContainerComponent],
  exports: [NtDrawerContainerComponent],
  imports: [CommonModule, NtScrollViewModule, NtScrollerModule, NtLocaleSensitiveModule, NtControlModule, NtDrawerLayoutModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtDrawerContainerModule { }
