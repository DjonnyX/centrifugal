import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtScrollViewComponent } from './nt-scroll-view.component';
import { NtLocaleSensitiveModule } from '../common';
import { NtDScrollerModule } from '../core/nt-d-scroller';

@NgModule({
  declarations: [NtScrollViewComponent],
  exports: [NtScrollViewComponent],
  imports: [CommonModule, NtDScrollerModule, NtLocaleSensitiveModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtScrollViewModule { }
