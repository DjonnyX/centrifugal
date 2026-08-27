import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtDrawerLayoutComponent } from './nt-drawer-layout.component';
import { NtControlModule } from '../../../common';

@NgModule({
    declarations: [NtDrawerLayoutComponent],
    exports: [NtDrawerLayoutComponent],
    imports: [CommonModule, NtControlModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtDrawerLayoutModule { }
