import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtDrawerLayoutComponent } from './nt-drawer-layout.component';

@NgModule({
    declarations: [NtDrawerLayoutComponent],
    exports: [NtDrawerLayoutComponent],
    imports: [CommonModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtDrawerLayoutModule { }
