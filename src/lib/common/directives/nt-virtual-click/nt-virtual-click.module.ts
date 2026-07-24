import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtVirtualClickDirective } from './nt-virtual-click.directive';

@NgModule({
  declarations: [NtVirtualClickDirective],
  exports: [NtVirtualClickDirective],
  imports: [CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtVirtualClickModule { }
