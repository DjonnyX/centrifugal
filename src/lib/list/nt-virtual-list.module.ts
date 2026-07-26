import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtVirtualListComponent } from './nt-virtual-list.component';
import { NtLocaleSensitiveModule, NtVirtualClickModule } from '../common/directives';
import { NtVirtualListItemModule } from './components/nt-list-item/nt-virtual-list-item.module';
import { NtScrollerModule } from './components/nt-scroller/nt-scroller.module';
import { NtPrerenderContainerModule } from './components/nt-prerender-container/nt-prerender-container.module';
import { NtVirtualListService } from './nt-virtual-list.service';
import { SCROLL_VIEW_SERVICE } from '../common';

@NgModule({
  declarations: [NtVirtualListComponent],
  exports: [NtVirtualListComponent],
  imports: [CommonModule, NtVirtualListItemModule, NtScrollerModule, NtPrerenderContainerModule, NtLocaleSensitiveModule, NtVirtualClickModule],
  providers: [
    { provide: SCROLL_VIEW_SERVICE, useClass: NtVirtualListService },
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtVirtualListModule { }
