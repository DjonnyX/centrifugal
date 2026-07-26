import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtScrollerModule } from '../scroll-view';
import { NtControlContainerComponent } from './nt-control-container.component';
import { NtLocaleSensitiveModule, SCROLL_VIEW_SERVICE } from '../common';
import { NtControlContainerService } from './nt-control-container.service';
import { NtDrawerContainerModule } from '../drawer-container';

@NgModule({
  declarations: [NtControlContainerComponent],
  exports: [NtControlContainerComponent],
  imports: [CommonModule, NtDrawerContainerModule, NtScrollerModule, NtLocaleSensitiveModule],
  providers: [
    { provide: SCROLL_VIEW_SERVICE, useClass: NtControlContainerService },
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NtControlContainerModule { }
