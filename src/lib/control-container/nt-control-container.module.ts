import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtScrollerModule, NtScrollViewModule } from '../scroll-view';
import { NtControlContainerComponent } from './nt-control-container.component';
import { NtLocaleSensitiveModule } from '../common';
import { NtKeyboardModule } from '../keyboard/nt-keyboard.module';

@NgModule({
  declarations: [NtControlContainerComponent],
  exports: [NtControlContainerComponent],
  imports: [CommonModule, NtScrollViewModule, NtScrollerModule, NtLocaleSensitiveModule, NtKeyboardModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtControlContainerModule { }
