import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtOverscrollIndicatorContainerComponent } from './nt-overscroll-indicator-container.component';
import { NtOverscrollIndicatorModule } from '../nt-overscroll-indicator/nt-overscroll-indicator.module';

@NgModule({
    declarations: [NtOverscrollIndicatorContainerComponent],
    exports: [NtOverscrollIndicatorContainerComponent],
    imports: [CommonModule, NtOverscrollIndicatorModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtOverscrollIndicatorContainerModule { }
