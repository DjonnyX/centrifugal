import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtScrollViewComponent } from './nt-scroll-view.component';
import { NtScrollerModule } from './components/nt-scroller/nt-scroller.module';
import { NtScrollViewService } from './nt-scroll-view.service';
import { CONTROL_CONTAINER_SERVICE, NtLocaleSensitiveModule, SCROLL_VIEW_SERVICE } from '../common';

@NgModule({
  declarations: [NtScrollViewComponent],
  exports: [NtScrollViewComponent],
  imports: [CommonModule, NtScrollerModule, NtLocaleSensitiveModule],
  providers: [
    { provide: SCROLL_VIEW_SERVICE, useClass: NtScrollViewService },
    { provide: CONTROL_CONTAINER_SERVICE, useValue: null, },
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtScrollViewModule { }
