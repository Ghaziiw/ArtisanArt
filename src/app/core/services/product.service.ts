import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: { id: string; name: string } | null;
  images: string[];
  craftsman: {
    id: string;
    businessName: string;
    workshopAddress: string;
    profileImage: string;
  };
  offer: { percentage: number } | null;
  avgRating: number;
  totalComments: number;
}


export interface ProductsResponse {
  items: Product[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getProducts(page: number = 1, limit: number = 20): Observable<ProductsResponse> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<ProductsResponse>(`${this.apiUrl}/products`, { params });
  }
}
