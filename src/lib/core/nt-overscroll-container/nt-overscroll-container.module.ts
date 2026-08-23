import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtOverscrollContainerComponent } from './nt-overscroll-container.component';
import { NtOverscrollAreaModule } from '../nt-overscroll-area/nt-overscroll-area.module';

@NgModule({
    declarations: [NtOverscrollContainerComponent],
    exports: [NtOverscrollContainerComponent],
    imports: [CommonModule, NtOverscrollAreaModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtOverscrollContainerModule { }
