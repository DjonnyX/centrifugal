import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtVirtualClickModule } from '../../../../../common/directives';
import { NtPrerenderVirtualListItemComponent } from './nt-prerender-list-item.component';

@NgModule({
  declarations: [NtPrerenderVirtualListItemComponent],
  exports: [NtPrerenderVirtualListItemComponent],
  imports: [CommonModule, NtVirtualClickModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtPrerenderVirtualListItemModule { }
