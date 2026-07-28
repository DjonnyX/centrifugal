import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtScrollerModule, NtScrollViewModule } from '../scroll-view';
import { NtDrawerContainerComponent } from './nt-drawer-container.component';
import { NtLocaleSensitiveModule, NtVirtualClickModule, SCROLL_VIEW_SERVICE } from '../common';
import { NtDrawerContainerService } from './nt-drawer-container.service';

@NgModule({
  declarations: [NtDrawerContainerComponent],
  exports: [NtDrawerContainerComponent],
  imports: [CommonModule, NtScrollViewModule, NtScrollerModule, NtLocaleSensitiveModule, NtVirtualClickModule],
  providers: [
    { provide: SCROLL_VIEW_SERVICE, useClass: NtDrawerContainerService },
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtDrawerContainerModule { }
