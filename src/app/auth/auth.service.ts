import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../shared/notification.service';
import { environment } from 'src/environments/environment';
import { AuthData } from './auth-data.model';

const USER_URL = environment.API_URL + '/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {}
  private token = null;
  private tokenTimer;
  userId: string;

  signUp(user) {
    this.http.post(USER_URL + '/signup', user).subscribe(response => {
      this.notificationService.showSuccess('User registeration successfull!');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    });
  }

  logIn(user: AuthData) {
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        USER_URL + '/login',
        user
      )
      .subscribe(response => {
        const expiresInDuration = response.expiresIn;
        if (response.token) {
          this.token = response.token;
          this.setAuthTimer(expiresInDuration);
          const now = new Date();
          this.userId = response.userId;
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(this.token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    const token = localStorage.getItem('token');
    const expirationDate = new Date(localStorage.getItem('expiration'));
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }
    const expiresIn = expirationDate.getTime() - new Date().getTime();
    if (expiresIn > 0) {
      this.token = token;
      this.userId = userId;
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  logOut() {
    this.http.post(USER_URL + '/logout', this.token).subscribe(response => {
      this.token = null;
      clearTimeout(this.tokenTimer);
      this.clearAuthData();
      this.userId = null;
      this.router.navigate(['/']);
    });
  }

  isAuthenticated() {
    return this.token != null;
  }

  getToken() {
    return this.token;
  }

  private saveAuthData(
    token: string,
    expirationDuration: Date,
    userId: string
  ) {
    let isoDate = new Date(
      expirationDuration.getTime() -
        expirationDuration.getTimezoneOffset() * 60000
    ).toISOString();
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', isoDate);
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  getUserId() {
    return this.userId;
  }
}
