import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtScrollerModule } from '../scroll-view';
import { NtControlContainerComponent } from './nt-control-container.component';
import { NtLocaleSensitiveModule } from '../common';
import { NtDrawerContainerModule } from '../drawer-container';

@NgModule({
  declarations: [NtControlContainerComponent],
  exports: [NtControlContainerComponent],
  imports: [CommonModule, NtDrawerContainerModule, NtScrollerModule, NtLocaleSensitiveModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtControlContainerModule { }
