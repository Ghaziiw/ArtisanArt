import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrderDto, MyOrdersResponse, Order, OrdersResponse, OrderStatusRequest } from '../models';
import { BASE_URL } from '../../../lib/auth-client';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${BASE_URL}/orders`;

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
  ): Observable<MyOrdersResponse> {
    return this.http.get<MyOrdersResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`, {
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

    /**
   * Get all orders for the authenticated craftsman
   */
  getCraftsmanOrders(
    page: number = 1,
    limit: number = 100
  ): Observable<OrdersResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<OrdersResponse>(
      `${this.apiUrl}/craftsman`,
      { 
        params,
        withCredentials: true 
      }
    );
  }

    /**
   * Update order status
   */
  updateOrderStatus(orderId: string, status: OrderStatusRequest): Observable<Order> {
    return this.http.patch<Order>(
      `${this.apiUrl}/${orderId}/status`,
      { status: status },
      { withCredentials: true }
    );
  }
}
