import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomScrollbarComponent } from './custom-scrollbar.component';
import { SubstrateModule } from '../substrate/substrate.module';

@NgModule({
  declarations: [CustomScrollbarComponent],
  exports: [CustomScrollbarComponent],
  imports: [CommonModule, SubstrateModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CustomScrollbarModule { }
