import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtVirtualScrollViewComponent } from './nt-virtual-scroll-view.component';
import { LocaleSensitiveModule } from './directives';
import { NtScrollerModule } from './components/nt-scroller/nt-scroller.module';
import { SCROLL_VIEW_SERVICE } from './components/nt-scroll-view/const';
import { NtVirtualScrollViewService } from './nt-virtual-scroll-view.service';

@NgModule({
  declarations: [NtVirtualScrollViewComponent],
  exports: [NtVirtualScrollViewComponent],
  imports: [CommonModule, NtScrollerModule, LocaleSensitiveModule],
  providers: [{ provide: SCROLL_VIEW_SERVICE, useClass: NtVirtualScrollViewService }],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtVirtualScrollViewModule { }
