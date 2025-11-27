import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Header } from '../../../../shared/components/header/header';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [Header,FormsModule, CommonModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css'],
})
export class LoginPage {
  credentials = { email: '', password: '' };
  loginError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit(form: NgForm) {
    if (!form.valid) {
      this.loginError = 'Please fill in all required fields correctly.';
      setTimeout(() => {
        this.loginError = '';
      }, 5000);
      return;
    }

    this.loginError = '';

    try {
      const result = await this.authService.login(this.credentials.email, this.credentials.password);

      // If login is successful, navigate to profile
      if ('user' in result) {
        this.router.navigate(['/profile']);
      } else {
        this.loginError = 'Email or password incorrect';
        setTimeout(() => {
          this.loginError = '';
        }, 5000);
      }

    } catch (error: any) {
      console.error(error);
      this.loginError = error?.message || 'Login failed';
    }
  }


  onSignUpClick(event: Event) {
    event.preventDefault();
    // Navigation vers signup
    this.router.navigate(['/signup']);
  }
}
