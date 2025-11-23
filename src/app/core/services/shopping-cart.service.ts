import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.service';

export interface AddToCartDto {
  productId: string;
  quantity?: number;
}

export interface ShoppingCartResponse {
  userId: string;
  quentity: number;
  createdAt: string;
  product: Product;
}

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
}
