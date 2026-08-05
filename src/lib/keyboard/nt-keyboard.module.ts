import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtLocaleSensitiveModule, NtVirtualClickModule } from '../common';
import { NtKeyboardComponent } from './nt-keyboard.component';

@NgModule({
    declarations: [NtKeyboardComponent],
    exports: [NtKeyboardComponent],
    imports: [CommonModule, NtLocaleSensitiveModule, NtVirtualClickModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtKeyboardModule { }
