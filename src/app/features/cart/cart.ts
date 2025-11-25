import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Header } from "../../shared/components/header/header";
import { CartProductCard } from './cart-product-card/cart-product-card';
import { GroupedCartResponse, ShoppingCartService } from '../../core/services/shopping-cart.service';
import { User } from '../../core/services/auth.service';
import { AuthService } from '../../core/services/auth.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [Header, RouterLink, CartProductCard, CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cartData: GroupedCartResponse | null = null;
  isLoading = true;
  cartError = '';
  user: User | null = null;

  constructor(
    private cartService: ShoppingCartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;

      if (this.user?.id) {
        this.loadCart();
      }
    });
  }

  /**
   * Load cart data grouped by craftsman
   */
  loadCart(): void {
    this.isLoading = true;
    this.cartError = '';

    this.cartService.getGroupedCart().subscribe({
      next: (data) => {
        this.cartData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load cart:', err);
        this.cartError = 'Failed to load cart. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Check if cart is empty
   */
  get isCartEmpty(): boolean {
    return !this.cartData || this.cartData.craftsmanGroups.length === 0;
  }

  /**
   * Handle quantity update event
   */
  onQuantityUpdated(): void {
    this.loadCart(); // Reload cart to get updated totals
  }

  /**
   * Handle item removed event
   */
  onItemRemoved(): void {
    this.loadCart(); // Reload cart to get updated data
  }

  /**
   * Navigate back to homepage
   */
  goBack(): void {
    this.router.navigate(['/']);
  }

  /**
   * Navigate to shopping
   */
  keepShopping(): void {
    this.router.navigate(['/']);
  }
}