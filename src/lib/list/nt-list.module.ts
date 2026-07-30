import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtListComponent } from './nt-list.component';
import { NtLocaleSensitiveModule, NtVirtualClickModule } from '../common/directives';
import { NtListItemModule } from './components/nt-list-item/nt-list-item.module';
import { NtScrollerModule } from './components/nt-scroller/nt-scroller.module';
import { NtPrerenderContainerModule } from './components/nt-prerender-container/nt-prerender-container.module';

@NgModule({
  declarations: [NtListComponent],
  exports: [NtListComponent],
  imports: [CommonModule, NtListItemModule, NtScrollerModule, NtPrerenderContainerModule, NtLocaleSensitiveModule, NtVirtualClickModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtListModule { }
