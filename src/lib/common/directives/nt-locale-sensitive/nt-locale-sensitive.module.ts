import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtLocaleSensitiveDirective } from './nt-locale-sensitive.directive';

@NgModule({
  declarations: [NtLocaleSensitiveDirective],
  exports: [NtLocaleSensitiveDirective],
  imports: [CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtLocaleSensitiveModule { }
