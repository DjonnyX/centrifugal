import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtVirtualScrollViewComponent } from './nt-virtual-scroll-view.component';
import { NtScrollerModule } from './components/nt-scroller/nt-scroller.module';
import { NtVirtualScrollViewService } from './nt-virtual-scroll-view.service';
import { CONTROL_CONTAINER_SERVICE, NtLocaleSensitiveModule, SCROLL_VIEW_SERVICE } from '../common';

@NgModule({
  declarations: [NtVirtualScrollViewComponent],
  exports: [NtVirtualScrollViewComponent],
  imports: [CommonModule, NtScrollerModule, NtLocaleSensitiveModule],
  providers: [
    { provide: SCROLL_VIEW_SERVICE, useClass: NtVirtualScrollViewService },
    { provide: CONTROL_CONTAINER_SERVICE, useValue: null, },
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtVirtualScrollViewModule { }
