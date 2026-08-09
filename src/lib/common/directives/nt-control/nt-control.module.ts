import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NtControlDirective } from './nt-control.directive';

@NgModule({
  declarations: [NtControlDirective],
  exports: [NtControlDirective],
  imports: [CommonModule, FormsModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtControlModule { }
