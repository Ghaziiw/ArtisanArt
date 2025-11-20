import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService, LoginResponse } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css'], // pluriel
})
export class LoginPage {
  credentials = { email: '', password: '' };
  loginError: string = '';

  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.authService.login(this.credentials.email, this.credentials.password)
      .subscribe({
        next: (res: LoginResponse) => {
          console.log('Logged in user:', res.user);
          // Redirection possible ici
        },
        error: (err: any) => {
          console.error(err);
          this.loginError = 'Email ou mot de passe invalide';
        }
      });
  }

  onSignUpClick(event: Event) {
    event.preventDefault();
    // Navigation vers signup
  }
}
