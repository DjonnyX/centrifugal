import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtScrollBarComponent } from './nt-scroll-bar.component';

@NgModule({
  declarations: [NtScrollBarComponent],
  exports: [NtScrollBarComponent],
  imports: [CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtScrollBarModule { }
