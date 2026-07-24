import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtPrerenderContainer } from './nt-prerender-container.component';
import { NtPrerenderListModule } from './components/nt-prerender-list/nt-prerender-list.module';

@NgModule({
    declarations: [NtPrerenderContainer],
    exports: [NtPrerenderContainer],
    imports: [CommonModule, NtPrerenderListModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtPrerenderContainerModule { }
