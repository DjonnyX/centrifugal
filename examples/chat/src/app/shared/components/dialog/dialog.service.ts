import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { IDialogData } from './interfaces';

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
@Injectable({
  providedIn: 'root'
})
export class DialogService implements OnDestroy{
  private _dialog = inject(Dialog);

  open<A = any>(data: IDialogData) {
    const dialogRef = this._dialog.open<A, IDialogData, DialogComponent>(DialogComponent, {
      autoFocus: false,
      data,
    });

    return dialogRef.closed;
  }

  ngOnDestroy(): void {
    this._dialog.closeAll();
  }
}
