import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Observable, map } from 'rxjs';
import { FilterService } from '../../../core/services/filter.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, AsyncPipe, RouterModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  // Observable to check if user is an artisan
  isArtisan$: Observable<boolean>;
  // Observable to check if user is an admin
  isAdmin$: Observable<boolean>;
  // Observable to check if user is a client
  isClient$: Observable<boolean>;
  
  // Search properties
  searchQuery: string = '';
  selectedType: 'products' | 'artisans' = 'products';

  constructor(
    public authService: AuthService, 
    private router: Router, 
    private filterService: FilterService
  ) {
    this.isAdmin$ = this.authService.user$.pipe(
      map(user => user ? user.role?.toLowerCase() === 'admin' : false)
    );
    this.isArtisan$ = this.authService.user$.pipe(
      map(user => user ? user.role?.toLowerCase() === 'artisan' : false)
    );
    this.isClient$ = this.authService.user$.pipe(
      map(user => user ? user.role?.toLowerCase() === 'client' : false)
    );
  }

  ngOnInit(): void {
    // Subscribe to view type changes
    this.filterService.viewType$.subscribe(type => {
      this.selectedType = type;
    });

    // Subscribe to search query changes
    this.filterService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }

  onSelectChange(event: any) {
    const value = event.target.value as 'products' | 'artisans';
    this.selectedType = value;
    this.filterService.setViewType(value);
    
    // Navigate to homepage if not already there
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  onSearchSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    // Update the search query in the service
    this.filterService.setSearchQuery(this.searchQuery);

    // Navigate to homepage if not already there
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }

  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearchSubmit();
    }
  }

  goToHomepage() {
    this.searchQuery = '';
    this.filterService.setSearchQuery('');
    this.filterService.setViewType('products');
    this.router.navigate(['/']);
  }
}