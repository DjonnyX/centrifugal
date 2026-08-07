import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtKeyStateDirective } from './key-state.derective';

@NgModule({
  declarations: [NtKeyStateDirective],
  exports: [NtKeyStateDirective],
  imports: [CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtKetStateModule { }
