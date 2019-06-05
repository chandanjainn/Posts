import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(public snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.snackBar.open(message, 'X', {
      duration: 1500
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'X', {
      duration: 2000
    });
  }
}
