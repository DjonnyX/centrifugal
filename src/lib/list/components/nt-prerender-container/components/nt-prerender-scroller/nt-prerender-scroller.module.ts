import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtPrerenderScrollerComponent } from './nt-prerender-scroller.component';
import { NtLocaleSensitiveModule } from '../../../../../common/directives';

@NgModule({
    declarations: [NtPrerenderScrollerComponent],
    exports: [NtPrerenderScrollerComponent],
    imports: [CommonModule, NtLocaleSensitiveModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtPrerenderScrollerModule { }
