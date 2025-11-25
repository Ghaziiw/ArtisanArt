import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductsResponse } from './product.service';

export interface OrderItem {
  productId: string;
  orderId: string;
  quantity: number;
  priceAtOrder: string;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatusRequest;
  createdAt: string;
  cin: string;
  location: string;
  state: string;
  phone: string;
  deliveryPrice: string;
  items: OrderItem[];
  user: {
    email: string;
    name: string;
  };
}

export interface OrdersResponse {
  items: Order[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: string;
    totalPages: number;
    currentPage: string;
  };
}

export enum OrderStatusRequest {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum TunisianState {
  TUNIS = 'TUNIS',
  ARIANA = 'ARIANA',
  BEN_AROUS = 'BEN_AROUS',
  MANOUBA = 'MANOUBA',
  NABEUL = 'NABEUL',
  ZAGHOUAN = 'ZAGHOUAN',
  BIZERTE = 'BIZERTE',
  BEJA = 'BEJA',
  JENDOUBA = 'JENDOUBA',
  LE_KAIRAOUAN = 'LE_KAIRAOUAN',
  KASSERINE = 'KASSERINE',
  SFAX = 'SFAX',
  SIDI_BOUZID = 'SIDI_BOUZID',
  SOUSSE = 'SOUSSE',
  MONASTIR = 'MONASTIR',
  MAHDIA = 'MAHDIA',
  GABES = 'GABES',
  MEDENINE = 'MEDENINE',
  TATAOUINE = 'TATAOUINE',
  TOZEUR = 'TOZEUR',
  KEBILI = 'KEBILI',
}

@Injectable({
  providedIn: 'root'
})
export class MyStoreService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Get all products for the authenticated craftsman
   */
  getCraftsmanProducts(
    page: number = 1,
    limit: number = 100,
    craftsmanId?: string
  ): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (craftsmanId) {
      params = params.set('craftsmanId', craftsmanId);
    }

    return this.http.get<ProductsResponse>(`${this.apiUrl}/products`, { 
      params,
      withCredentials: true 
    });
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
      `${this.apiUrl}/orders/craftsman`,
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
      `${this.apiUrl}/orders/${orderId}/status`,
      { status: status },
      { withCredentials: true }
    );
  }
}