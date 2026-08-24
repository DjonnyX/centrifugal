import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtSliderModule } from '../slider';
import { NtScrollViewModule } from '../scroll-view';
import { NtSwitchComponent } from './nt-switch.component';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NtLocaleSensitiveModule } from '../common';
import { NtOverscrollContainerModule } from '../core/nt-overscroll-container/nt-overscroll-container.module';

@NgModule({
    declarations: [NtSwitchComponent],
    exports: [NtSwitchComponent],
    imports: [CommonModule, NtOverscrollContainerModule, NtScrollViewModule, NtSliderModule, NtLocaleSensitiveModule, CdkScrollableModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtSwitchModule { }
