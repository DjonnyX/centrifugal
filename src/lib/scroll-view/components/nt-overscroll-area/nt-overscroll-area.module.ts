import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtOverscrollAreaComponent } from './nt-overscroll-area.component';

@NgModule({
    declarations: [NtOverscrollAreaComponent],
    exports: [NtOverscrollAreaComponent],
    imports: [CommonModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtOverscrollAreaModule { }
