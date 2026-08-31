import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtSheetComponent } from './nt-sheet.component';
import { NtControlModule, NtLocaleSensitiveModule } from '../common';
import { NtSScrollerModule } from '../core/nt-s-scroller/nt-s-scroller.module';

@NgModule({
    declarations: [NtSheetComponent],
    exports: [NtSheetComponent],
    imports: [CommonModule, NtSScrollerModule, NtControlModule, NtLocaleSensitiveModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtSheetModule { }
