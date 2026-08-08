import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NtVirtualClickDirective } from './nt-virtual-click.directive';

@NgModule({
  declarations: [NtVirtualClickDirective],
  exports: [NtVirtualClickDirective],
  imports: [CommonModule, FormsModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtVirtualClickModule { }
