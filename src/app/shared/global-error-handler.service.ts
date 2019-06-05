import { Injectable, Injector, NgZone, ErrorHandler } from '@angular/core';
import { NotificationService } from './notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector, private ngZone: NgZone) {}

  handleError(error) {
    const GENERIC_ERROR_MESSAGE = 'Some error occured. ';
    const CONNECTIVITY_ERROR_MESSAGE = 'No Internet Connection. ';

    if (error instanceof Error) {
      this.runNgZone(error.message);
    }
    if (error instanceof HttpErrorResponse) {
      if (!navigator.onLine) {
        this.runNgZone(CONNECTIVITY_ERROR_MESSAGE);
      } else if (error.error.message) {
        this.runNgZone(error.error.message);
      } else {
        this.runNgZone(GENERIC_ERROR_MESSAGE);
      }
    }
  }

  /**
   * This method is required to overcome the bug where snackbar is displayed twice on the screen.
   * This occurs because the ErrorHandler is not called within the Angular zone.
   *
   * @param notificationService
   * @param errorMessage
   */
  private runNgZone(errorMessage: string) {
    const notificationService = this.injector.get(NotificationService);
    this.ngZone.run(() => notificationService.showError(errorMessage));
  }
}
