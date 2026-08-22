import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtSliderModule } from '../slider';
import { NtSwitchComponent } from './nt-switch.component';
import { NtOverscrollContainerModule } from '../scroll-view/components/nt-overscroll/nt-overscroll-container.module';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NtLocaleSensitiveModule } from '../common';

@NgModule({
    declarations: [NtSwitchComponent],
    exports: [NtSwitchComponent],
    imports: [CommonModule, NtOverscrollContainerModule, NtSliderModule, NtLocaleSensitiveModule, CdkScrollableModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtSwitchModule { }
