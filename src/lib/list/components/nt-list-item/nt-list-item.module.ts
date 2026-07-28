import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtListItemComponent } from './nt-list-item.component';
import { NtVirtualClickModule } from '../../../common/directives';

@NgModule({
  declarations: [NtListItemComponent],
  exports: [NtListItemComponent],
  imports: [CommonModule, NtVirtualClickModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtListItemModule { }
