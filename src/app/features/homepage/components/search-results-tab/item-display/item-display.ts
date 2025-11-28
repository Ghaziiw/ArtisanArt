import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartService } from '../../../../../core/services/shopping-cart.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../../core/models';

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
  showMessage = false;
  message: { type: 'success' | 'error'; text: string } = { type: 'success', text: '' };
  isHiding = false;

  constructor(
    private cartService: ShoppingCartService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Navigate to artisan profile
   */
  navigateToArtisan(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/artisan-profile', this.product.craftsman.userId]);
  }

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

          // Show success message
          this.displayMessage('success', 'Product added to cart successfully!');

          // Reset success state after 2 seconds
          setTimeout(() => {
            this.addToCartSuccess = false;
          }, 2000);
        },
        error: (err) => {
          console.error('Failed to add to cart:', err);
          this.isAddingToCart = false;

          const errorMessage = err.error?.message || 'Failed to add to cart';

          // Show error message
          this.displayMessage('error', errorMessage);
        },
      });
  }

  /**
   * Display message with animations
   */
  private displayMessage(type: 'success' | 'error', text: string): void {
    this.message = { type, text };
    this.showMessage = true;
    this.isHiding = false;

    // Start hide animation after 4.5 seconds
    setTimeout(() => {
      this.isHiding = true;

      // Remove from DOM after animation completes (0.5s)
      setTimeout(() => {
        this.showMessage = false;
        this.isHiding = false;
      }, 500);
    }, 4500);
  }
}
