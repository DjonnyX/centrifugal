import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtScrollViewModule } from '../scroll-view';
import { NtDrawerComponent } from './nt-drawer.component';
import { NtLocaleSensitiveModule, NtControlModule } from '../common';
import { NtDrawerLayoutModule } from './layouts/nt-drawer-layout/nt-drawer-layout.module';
import { NtDScrollerModule } from '../core/nt-d-scroller';

@NgModule({
  declarations: [NtDrawerComponent],
  exports: [NtDrawerComponent],
  imports: [CommonModule, NtScrollViewModule, NtDScrollerModule, NtLocaleSensitiveModule, NtControlModule, NtDrawerLayoutModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtDrawerModule { }
