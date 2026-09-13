import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtTouchableHighlightComponent } from './nt-touchable-highlight.component';
import { NtControlModule } from '../common';

@NgModule({
  declarations: [NtTouchableHighlightComponent],
  exports: [NtTouchableHighlightComponent],
  imports: [CommonModule, NtControlModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtTouchableHighlightModule { }
