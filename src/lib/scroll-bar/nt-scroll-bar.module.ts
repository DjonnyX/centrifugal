import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtScrollerModule } from '../scroll-view';
import { NtLocaleSensitiveModule } from '../common';
import { NtDrawerContainerModule } from '../drawer-container';
import { NtScrollBarComponent } from './nt-scroll-bar.component';

@NgModule({
  declarations: [NtScrollBarComponent],
  exports: [NtScrollBarComponent],
  imports: [CommonModule, NtDrawerContainerModule, NtScrollerModule, NtLocaleSensitiveModule],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtControlContainerModule { }
