import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.logIn({
      email: form.value.email,
      password: form.value.password
    });
  }

  
}
