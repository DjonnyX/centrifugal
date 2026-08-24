import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtTabsComponent } from './nt-tabs.component';
import { NtOverscrollContainerModule } from '../core/nt-overscroll-container/nt-overscroll-container.module';
import { NtListModule } from '../list';

@NgModule({
    declarations: [NtTabsComponent],
    exports: [NtTabsComponent],
    imports: [CommonModule, NtOverscrollContainerModule, NtListModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtTabsModule { }
