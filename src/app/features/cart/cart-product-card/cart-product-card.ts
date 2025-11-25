import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartService, CraftsmanGroup, ShoppingCartItem} from '../../../core/services/shopping-cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cart-product-card',
  imports: [CommonModule],
  templateUrl: './cart-product-card.html',
  styleUrl: './cart-product-card.css',
})
export class CartProductCard {
  @Input() craftsmanGroup!: CraftsmanGroup;
  @Output() quantityUpdated = new EventEmitter<void>();
  @Output() itemRemoved = new EventEmitter<void>();

  isUpdating = false;

  constructor(private cartService: ShoppingCartService) {}

  /**
   * Calculate the price after discount for a product
   */
  calculateDiscountedPrice(price: number, offerPercentage?: number): number {
    const p = Number(price) || 0;
    if (!offerPercentage) return p;
    return p * (1 - offerPercentage / 100);
  }

  /**
   * Get the final price of a product (with or without discount)
   */
  getFinalPrice(item: ShoppingCartItem): number {
    const price = Number(item.product.price) || 0;
    const offer = item.product.offer?.percentage;
    return this.calculateDiscountedPrice(price, offer);
  }

  // To store quantity update errors for each product
  productQuantityErrors: { [productId: string]: string } = {};

  /**
   * Increment quantity
   */
  incrementQuantity(productId: string, currentQty: number) {
    if (this.isUpdating) return;

    this.isUpdating = true;
    this.productQuantityErrors[productId] = ''; // reset l'erreur

    this.cartService.updateCartItem(productId, currentQty + 1).subscribe({
      next: () => {
        this.isUpdating = false;
      },
      error: (err) => {
        this.isUpdating = false;
        const message = err.error?.message || 'An unexpected error occurred';
        this.productQuantityErrors[productId] = message;

        // Supprimer le message après 5 secondes
        setTimeout(() => {
          this.productQuantityErrors[productId] = '';
        }, 5000);
      }
    });
  }

  /**
   * Decrement quantity
   */
  decrementQuantity(productId: string, currentQty: number) {
    if (currentQty <= 1 || this.isUpdating) return;

    this.isUpdating = true;
    this.productQuantityErrors[productId] = ''; // reset l'erreur

    this.cartService.updateCartItem(productId, currentQty - 1).subscribe({
      next: () => {
        this.isUpdating = false;
      },
      error: (err) => {
        this.isUpdating = false;
        const message = err.error?.message || 'An unexpected error occurred';
        this.productQuantityErrors[productId] = message;

        // Supprimer le message après 5 secondes
        setTimeout(() => {
          this.productQuantityErrors[productId] = '';
        }, 5000);
      }
    });
  }

  /**
   * Update cart item quantity
   */
  // private updateQuantity(productId: string, newQuantity: number): void {
  //   this.isUpdating = true;

  //   this.cartService.updateCartItem(productId, newQuantity).subscribe({
  //     next: () => {
  //       this.isUpdating = false;
  //       this.quantityUpdated.emit();
  //     },
  //     error: (err: any) => {
  //       console.error('Failed to update quantity:', err);
  //       this.isUpdating = false;
  //       alert('Failed to update quantity');
  //     }
  //   });
  // }

  /**
   * Remove item from cart
   */
  removeItem(productId: string): void {
    if (!confirm('Remove this item from cart?')) return;

    this.isUpdating = true;

    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.isUpdating = false;
        this.itemRemoved.emit();
      },
      error: (err: any) => {
        console.error('Failed to remove item:', err);
        this.isUpdating = false;
        alert('Failed to remove item');
      }
    });
  }
}