import { CommonModule } from '@angular/common';
import { Component, input, output, viewChild } from '@angular/core';
import { MessaageInputComponent } from '@entities/message/messaage-input/messaage-input.component';

@Component({
  selector: 'x-messaage-creator',
  imports: [CommonModule, MessaageInputComponent],
  templateUrl: './messaage-creator.component.html',
  styleUrl: './messaage-creator.component.scss'
})
export class MessaageCreatorComponent {
  private _input = viewChild<MessaageInputComponent>('input');

  creating = input<boolean>(false);

  onSend = output<string>();

  reset() {
    const input = this._input();
    if (input) {
      input.reset();
    }
  }

  onCreateHandler(e: { nativeEvent: Event, value: string | undefined }) {
    if (e.value) {
      this.onSend.emit(e.value);
    }
  }
}
