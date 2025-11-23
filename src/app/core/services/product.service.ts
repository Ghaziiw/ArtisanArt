import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductFilters } from '../../features/homepage/components/search-filters-bar/product-filters.interface';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: { id: string; name: string } | null;
  images: string[] | null;
  craftsman: {
    userId: string;
    businessName: string;
    workshopAddress: string;
    profileImage: string | null;
    avgRating: number;
    totalComments: number;
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

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  /**
    * Fetches a paginated list of products from the API.
   */
  getProducts(
    page: number = 1,
    limit: number = 20,
    filters?: ProductFilters
  ): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      if (filters.productName) params = params.set('name', filters.productName);
      if (filters.categoryIds?.length) {
        filters.categoryIds.forEach(id => {
          params = params.append('categoriesId', id);
        });
      }
      if (filters.minPrice != null) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice != null) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.sortByPrice) params = params.set('sortByPrice', filters.sortByPrice);
      if (filters.craftsmanName) params = params.set('craftsmanName', filters.craftsmanName);
      if (filters.minRating != null) params = params.set('minRating', filters.minRating.toString());
      if (filters.freeShipping) params = params.set('freeShipping', 'true');
    }

    return this.http.get<ProductsResponse>(`${this.apiUrl}`, { params });
  }
}
