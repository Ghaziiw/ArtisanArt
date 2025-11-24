import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, AsyncPipe, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  // Observable to check if user is an artisan
  isArtisan$: Observable<boolean>;

  constructor(public authService: AuthService, private router: Router) {
    // Create an observable that checks if the current user is an artisan
    this.isArtisan$ = this.authService.user$.pipe(
      map(user => user?.role === 'artisan')
    );
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}