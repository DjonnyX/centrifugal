import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtVirtualListItemComponent } from './nt-virtual-list-item.component';
import { NtVirtualClickModule } from '../../../common/directives';

@NgModule({
  declarations: [NtVirtualListItemComponent],
  exports: [NtVirtualListItemComponent],
  imports: [CommonModule, NtVirtualClickModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtVirtualListItemModule { }
