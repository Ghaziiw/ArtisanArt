import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Header } from "../../shared/components/header/header";
import { CartProductCard } from './cart-product-card/cart-product-card';
import { ShoppingCartService } from '../../core/services/shopping-cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { GroupedCartResponse, TunisianState, User } from '../../core/models';
import { Footer } from '../../shared/components/footer/footer';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [Header, RouterLink, CartProductCard, CommonModule, Footer, FormsModule],
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
    private authService: AuthService,
    private orderService: OrderService
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
    this.recalcCartSummary();
  }

  /**
   * Handle item removed event
   */
  onItemRemoved(): void {
    if (!this.cartData) return;

    // Remove groups that no longer have products
    this.cartData.craftsmanGroups = this.cartData.craftsmanGroups.filter(
      group => group.items.length > 0
    );

    this.recalcCartSummary();
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

  /** Recalculate cart summary (total items and grand total) */
  private recalcCartSummary() {
    if (!this.cartData) return;

    // Total items
    this.cartData.totalItems = this.cartData.craftsmanGroups.reduce(
      (sum, group) => sum + group.items.reduce((s, item) => s + item.quantity, 0),
      0
    );

    // Grand total
    this.cartData.grandTotal = this.cartData.craftsmanGroups.reduce(
      (sum, group) => sum + group.total,
      0
    );
  }

  cin = "12345678";
  location = "sfax gremda";
  state = TunisianState.SFAX;
  phone = "12345678";

  orderError: string = "";

  orderAll() {
    if (!this.cartData || this.cartData.craftsmanGroups.length === 0) {
      this.orderError = "Your cart is empty!";
      setTimeout(() => {
        this.orderError = "";
      }, 5000);
      return;
    }

    const confirmed = confirm("Confirm your order for all items?");
    if (!confirmed) return;

    this.isLoading = true;
    this.cartError = "";

    const orderData = {
      cin: this.cin,
      location: this.location,
      state: this.state,
      phone: this.phone,
    };

    this.orderService.checkoutAllCraftsmen(orderData).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Clear the cart locally
        if (this.cartData) {
          this.cartData.craftsmanGroups = [];
          this.cartData.totalItems = 0;
          this.cartData.grandTotal = 0;
        }

        this.router.navigate(['/orders']);
      },

      error: (err) => {
        this.isLoading = false;

        const message =
          err.error?.message ??
          err.error?.error ??
          "Failed to create the order. Please try again.";

        this.orderError = message;
        setTimeout(() => {
          this.orderError = "";
        }, 5000);
      },
    });
  }

}