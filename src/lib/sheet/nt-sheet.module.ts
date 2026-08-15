import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtSheetComponent } from './nt-sheet.component';
import { NtLocaleSensitiveModule } from '../common';
import { NtScrollerModule } from '../list/components/nt-scroller/nt-scroller.module';

@NgModule({
    declarations: [NtSheetComponent],
    exports: [NtSheetComponent],
    imports: [CommonModule, NtScrollerModule, NtLocaleSensitiveModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtSheetModule { }
