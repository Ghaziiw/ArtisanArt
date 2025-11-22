import { Component, Input } from '@angular/core';
import { Product } from '../../../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { ShoppingCartService } from '../../../../../core/services/shopping-cart.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-item-display',
  imports: [CommonModule, FormsModule],
  templateUrl: './item-display.html',
  styleUrl: './item-display.css',
})
export class ItemDisplay {
  @Input() product!: Product;

  isAddingToCart = false;
  addToCartError = '';
  addToCartSuccess = false;

  constructor(
    private cartService: ShoppingCartService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Add product to cart
   */
  onAddToCart(): void {
    // Check if user is logged in
    const currentUser = this.authService.currentUser;

    if (!currentUser) {
      // Redirect to signup if not logged in
      this.router.navigate(['/signup']);
      return;
    }

    // Prevent multiple clicks
    if (this.isAddingToCart) return;

    this.isAddingToCart = true;
    this.addToCartError = '';
    this.addToCartSuccess = false;

    // Add to cart with default quantity of 1
    this.cartService
      .addToCart({
        productId: this.product.id,
        quantity: 1,
      })
      .subscribe({
        next: (response) => {
          console.log('Product added to cart:', response);
          this.isAddingToCart = false;
          this.addToCartSuccess = true;

          // Reset success message after 2 seconds
          setTimeout(() => {
            this.addToCartSuccess = false;
          }, 2000);
        },
        error: (err) => {
          console.error('Failed to add to cart:', err);
          this.isAddingToCart = false;
          this.addToCartError = err.error?.message || 'Failed to add to cart';

          // Clear error after 3 seconds
          setTimeout(() => {
            this.addToCartError = '';
          }, 3000);
        },
      });
  }
}
