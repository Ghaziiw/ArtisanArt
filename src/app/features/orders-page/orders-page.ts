import { Component, OnInit, Output, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from "../../shared/components/header/header";
import { Footer } from "../../shared/components/footer/footer";
import { OrderCard } from "./order-card/order-card";
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { MyOrdersResponse, Order } from '../../core/models';
import { filter, take } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-orders-page',
  imports: [Header, Footer, OrderCard, CommonModule, RouterModule],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.css',
})
export class OrdersPage implements OnInit {
  orders: MyOrdersResponse | null = null;
  isLoading = true;
  errorMessage = '';
  currentPage = 1;
  totalPages = 1;
  
  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.authService.user$
      .pipe(
        filter(user => user !== null), // Ensure user is logged in
        take(1) // Take only the first emitted value
      )
      .subscribe(user => {
        this.loadOrders();
      });
  }

  /**
   * Load user's orders
   */
  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getMyOrders(this.currentPage, 10).subscribe({
      next: (response) => {
        this.orders = response;
        this.totalPages = response.meta.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.errorMessage = 'Failed to load orders. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Navigate back to homepage
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadOrders();
    }
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadOrders();
    }
  }

  /**
   * Cancel an order
   */
  onCancelOrder(orderId: string): void {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {
        // Reload orders after cancellation
        this.loadOrders();
        alert('Order cancelled successfully');
      },
      error: (err) => {
        console.error('Failed to cancel order:', err);
        alert('Failed to cancel order. Please try again.');
      }
    });
  }
}