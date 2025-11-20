import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule,CommonModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
    credentials = {
    email: '',
    password: ''
  };

  loginError: string = '';

  onSubmit(form: any) {
    if (form.valid) {
      // Handle login logic
    }
  }

  onSignUpClick(event: Event) {
    event.preventDefault();
    // Handle navigation to sign up
  }
}
