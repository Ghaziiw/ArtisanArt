import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddToCartDto, GroupedCartResponse, ShoppingCartItem, ShoppingCartResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private apiUrl = 'http://localhost:3000/shoppingcarts';

  constructor(private http: HttpClient) {}

  /**
   * Add a product to the shopping cart
   */
  addToCart(data: AddToCartDto): Observable<ShoppingCartResponse> {
    return this.http.post<ShoppingCartResponse>(this.apiUrl, data, { withCredentials: true });
  }

  /**
   * Get all cart items grouped by craftsman
   */
  getGroupedCart(): Observable<GroupedCartResponse> {
    return this.http.get<GroupedCartResponse>(`${this.apiUrl}/craftsman-grouped`, {
      withCredentials: true,
    });
  }

  /**
   * Update cart item quantity
   * @param productId - ID of the product to update
   * @param quantity - New quantity (set to 0 to remove item)
   */
  updateCartItem(
    productId: string,
    quantity: number
  ): Observable<ShoppingCartItem | { message: string }> {
    return this.http.patch<ShoppingCartItem | { message: string }>(
      `${this.apiUrl}/${productId}`,
      { quantity },
      { withCredentials: true }
    );
  }

  /**
   * Remove a product from the cart
   * @param productId - ID of the product to remove
   */
  removeFromCart(productId: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.apiUrl}/${productId}`,
      { quantity: 0 },
      { withCredentials: true }
    );
  }
}
