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
  incrementQuantity(item: ShoppingCartItem) {
    if (this.isUpdating) return;

    this.isUpdating = true;
    this.productQuantityErrors[item.productId] = ''; // reset l'erreur
    this.cartService.updateCartItem(item.productId, item.quantity + 1).subscribe({
      next: () => {
        item.quantity += 1; // Update quantity locally
        this.recalcTotals(); // Recalculate totals
        this.quantityUpdated.emit(); // Notify parent component
        this.isUpdating = false;
      },
      error: (err) => {
        this.isUpdating = false;
        const message = err.error?.message || 'An unexpected error occurred';
        this.productQuantityErrors[item.productId] = message;

        setTimeout(() => {
          this.productQuantityErrors[item.productId] = '';
        }, 5000);
      }
    });
  }

  /**
   * Decrement quantity
   */
  decrementQuantity(item: ShoppingCartItem) {
    if (item.quantity <= 1 || this.isUpdating) return;

    this.isUpdating = true;
    this.productQuantityErrors[item.productId] = ''; // reset the error
    this.cartService.updateCartItem(item.productId, item.quantity - 1).subscribe({
      next: () => {
        item.quantity -= 1; // Update quantity locally
        this.recalcTotals(); // Recalculate totals
        this.quantityUpdated.emit(); // Notify parent component
        this.isUpdating = false;
      },
      error: (err) => {
        this.isUpdating = false;
        const message = err.error?.message || 'An unexpected error occurred';
        this.productQuantityErrors[item.productId] = message;

        // Remove the message after 5 seconds
        setTimeout(() => {
          this.productQuantityErrors[item.productId] = '';
        }, 5000);
      }
    });
  }

  /**
   * Remove item from cart
   */
  removeItem(productId: string): void {
    if (!confirm('Remove this item from cart?')) return;

    this.isUpdating = true;

    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.craftsmanGroup.items = this.craftsmanGroup.items.filter(
          item => item.productId !== productId
        ); // Remove item locally
        this.recalcTotals(); // Recalculate totals
        this.itemRemoved.emit(); // Notify parent component
        this.isUpdating = false;
      },
      error: (err: any) => {
        console.error('Failed to remove item:', err);
        this.isUpdating = false;
        alert('Failed to remove item');
      }
    });
  }

  /** Recalculate subtotal and total for the craftsman group */
  private recalcTotals() {
    this.craftsmanGroup.subtotal = this.craftsmanGroup.items.reduce(
      (sum, item) => sum + this.getFinalPrice(item) * item.quantity,
      0
    );
    this.craftsmanGroup.total = this.craftsmanGroup.subtotal + this.craftsmanGroup.deliveryPrice;
  }

}