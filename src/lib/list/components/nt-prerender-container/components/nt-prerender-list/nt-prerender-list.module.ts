import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtPrerenderVirtualListItemModule } from '../nt-prerender-list-item/nt-prerender-list-item.module';
import { NtPrerenderScrollerModule } from '../nt-prerender-scroller/nt-prerender-scroller.module';
import { NtPrerenderList } from './nt-prerender-list.component';

@NgModule({
    declarations: [NtPrerenderList],
    exports: [NtPrerenderList],
    imports: [CommonModule, NtPrerenderVirtualListItemModule, NtPrerenderScrollerModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtPrerenderListModule { }
