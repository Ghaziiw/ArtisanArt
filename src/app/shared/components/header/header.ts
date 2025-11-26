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
  // Observable to check if user is an admin
  isAdmin$: Observable<boolean>;

  constructor(public authService: AuthService, private router: Router) {
    this.isAdmin$ = this.authService.user$.pipe(
      map(user => user ? user.role?.toLowerCase() === 'admin' : false)
    );
    this.isArtisan$ = this.authService.user$.pipe(
      map(user => user ? user.role?.toLowerCase() === 'artisan' : false)
    );
    console.log(this.isAdmin$, this.isArtisan$);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}