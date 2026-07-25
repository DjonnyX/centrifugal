import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtScrollerModule, NtVirtualScrollViewModule } from '../scroll-view';
import { NtControlContainerComponent } from './nt-control-container.component';
import { NtLocaleSensitiveModule, SCROLL_VIEW_SERVICE } from '../common';
import { NtControlContainerService } from './nt-control-container.service';

@NgModule({
  declarations: [NtControlContainerComponent],
  exports: [NtControlContainerComponent],
  imports: [CommonModule, NtVirtualScrollViewModule, NtScrollerModule, NtLocaleSensitiveModule],
  providers: [
    { provide: SCROLL_VIEW_SERVICE, useClass: NtControlContainerService },
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtControlContainerModule { }
