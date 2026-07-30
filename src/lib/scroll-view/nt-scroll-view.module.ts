import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtScrollViewComponent } from './nt-scroll-view.component';
import { NtScrollerModule } from './components/nt-scroller/nt-scroller.module';
import { NtLocaleSensitiveModule } from '../common';

@NgModule({
  declarations: [NtScrollViewComponent],
  exports: [NtScrollViewComponent],
  imports: [CommonModule, NtScrollerModule, NtLocaleSensitiveModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtScrollViewModule { }
