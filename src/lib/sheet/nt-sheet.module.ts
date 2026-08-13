import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtSheetComponent } from './nt-sheet.component';
import { NtScrollerModule } from '../scroll-view/components/nt-scroller/nt-scroller.module';
import { NtLocaleSensitiveModule } from '../common';

@NgModule({
    declarations: [NtSheetComponent],
    exports: [NtSheetComponent],
    imports: [CommonModule, NtScrollerModule, NtLocaleSensitiveModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtSheetModule { }
