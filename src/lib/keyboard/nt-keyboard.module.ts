import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtLocaleSensitiveModule, NtControlModule } from '../common';
import { NtKeyboardComponent } from './nt-keyboard.component';
import { NtKetStateModule } from './directives/key-state.module';

@NgModule({
    declarations: [NtKeyboardComponent],
    exports: [NtKeyboardComponent],
    imports: [CommonModule, NtLocaleSensitiveModule, NtControlModule, NtKetStateModule],
    schemas: [NO_ERRORS_SCHEMA],
})
export class NtKeyboardModule { }
