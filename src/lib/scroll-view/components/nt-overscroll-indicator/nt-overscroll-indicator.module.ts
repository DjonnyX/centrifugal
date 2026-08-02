import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtOverscrollIndicatorComponent } from './nt-overscroll-indicator.component';

@NgModule({
    declarations: [NtOverscrollIndicatorComponent],
    exports: [NtOverscrollIndicatorComponent],
    imports: [CommonModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtOverscrollIndicatorModule { }
