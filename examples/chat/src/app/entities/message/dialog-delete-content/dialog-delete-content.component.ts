import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { CheckBoxComponent } from '@shared/components/check-box';
import { ILocalization, LocaleSensitiveDirective, LocalizationService } from '@shared/localization';

@Component({
  selector: 'x-dialog-delete-content',
  imports: [CommonModule, LocaleSensitiveDirective, CheckBoxComponent],
  templateUrl: './dialog-delete-content.component.html',
  styleUrl: './dialog-delete-content.component.scss'
})
export class DialogDeleteContentComponent {
  private _$changes = new BehaviorSubject<boolean>(false);
  readonly $changes = this._$changes.asObservable();

  readonly localization: Signal<ILocalization | undefined>;

  private _localizationService = inject(LocalizationService);

  constructor() {
    this.localization = toSignal(this._localizationService.$localization);
  }

  onCheckHandler(checked: boolean) {
    this._$changes.next(checked);
  }
}
