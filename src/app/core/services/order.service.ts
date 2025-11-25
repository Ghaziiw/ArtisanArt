import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, TunisianState } from './store.service';

export interface CreateOrderDto {
  cin: string;
  location: string;
  state: TunisianState;
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  /**
   * Checkout all items in cart (creates orders for all craftsmen)
   * @param orderData - Shipping information (CIN, location, state, phone)
   * @returns Multiple orders grouped by craftsman
   */
  checkoutAllCraftsmen(orderData: CreateOrderDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/checkout`, orderData, {
      withCredentials: true,
    });
  }

  /**
   * Checkout items from a specific craftsman
   * @param craftsmanId - ID of the craftsman
   * @param orderData - Shipping information (CIN, location, state, phone)
   * @returns Single order for the specified craftsman
   */
  checkoutSingleCraftsman(
    craftsmanId: string,
    orderData: CreateOrderDto
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/checkout/${craftsmanId}`,
      orderData,
      { withCredentials: true }
    );
  }

  /**
   * Get all orders for the authenticated user
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   */
  getMyOrders(
    page: number = 1,
    limit: number = 10
  ): Observable<{
    items: Order[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    return this.http.get<any>(`${this.apiUrl}/my-orders?page=${page}&limit=${limit}`, {
      withCredentials: true,
    });
  }

  /**
   * Get a specific order by ID
   * @param orderId - Order ID
   */
  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`, { withCredentials: true });
  }

  /**
   * Cancel an order (only if status is PENDING)
   * @param orderId - Order ID to cancel
   */
  cancelOrder(orderId: string): Observable<Order> {
    return this.http.patch<Order>(
      `${this.apiUrl}/${orderId}/status`,
      { status: 'CANCELLED' },
      { withCredentials: true }
    );
  }
}
