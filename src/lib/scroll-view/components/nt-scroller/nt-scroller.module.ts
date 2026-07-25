import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtScrollerComponent } from './nt-scroller.component';
import { NtScrollBarModule } from '../nt-scroll-bar/nt-scroll-bar.module';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NtLocaleSensitiveModule } from '../../../common';

@NgModule({
  declarations: [NtScrollerComponent],
  exports: [NtScrollerComponent],
  imports: [CommonModule, NtScrollBarModule, NtLocaleSensitiveModule, CdkScrollableModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtScrollerModule { }
