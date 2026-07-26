import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtBaseScrollBarComponent } from './nt-base-scroll-bar.component';

@NgModule({
  declarations: [NtBaseScrollBarComponent],
  exports: [NtBaseScrollBarComponent],
  imports: [CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtBaseScrollBarModule { }
