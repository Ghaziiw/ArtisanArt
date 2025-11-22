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
    if (!form.valid) return;

    this.loginError = '';

    try {
      const result = await this.authService.login(this.credentials.email, this.credentials.password);

      // Si Better Auth renvoie un objet Data, il contient user
      if ('user' in result) {
        // login réussi
        this.router.navigate(['/profile']);
      } else {
        // login échoué
        this.loginError = 'Email ou mot de passe invalide';
      }

    } catch (error: any) {
      console.error(error);
      this.loginError = error?.message || 'Échec de la connexion';
    }
  }


  onSignUpClick(event: Event) {
    event.preventDefault();
    // Navigation vers signup
    this.router.navigate(['/signup']);
  }
}
