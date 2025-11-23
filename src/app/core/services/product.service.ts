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

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId?: string;
  images?: File[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  images?: string[];
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
      if (filters.craftsmanId) params = params.set('craftsmanId',filters.craftsmanId)
    }

    return this.http.get<ProductsResponse>(`${this.apiUrl}`, { params });
  }

  /**
   * Deletes a product by ID (Artisan/Admin)
   * @param productId - ID of the product to delete
   */
  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`, { withCredentials: true });
  }

    /**
   * Updates a product (Artisan/Admin)
   * @param productId - ID of the product to update
   * @param updateData - Product data to update
   */
  updateProduct(productId: string, updateData: UpdateProductDto): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${productId}`, updateData, {
      withCredentials: true,
    });
  }

    /**
   * Creates a new product (Artisan)
   * @param productData - Product data including images
   */
  addProduct(productData: CreateProductDto): Observable<Product> {
    const formData = new FormData();
    
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('stock', productData.stock.toString());
    
    if (productData.categoryId) {
      formData.append('categoryId', productData.categoryId);
    }
    
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach(image => {
        formData.append('images', image);
      });
    }

    return this.http.post<Product>(`${this.apiUrl}`, formData, {
      withCredentials: true,
    });
  }
}
