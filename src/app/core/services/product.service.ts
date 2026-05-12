import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProductDto, Product, ProductFilters, ProductsResponse, UpdateProductDto } from '../models';
import { BASE_URL } from '../../../lib/auth-client';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${BASE_URL}/products`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches a paginated list of products from the API.
   */
  getProducts(
    page: number = 1,
    limit: number = 20,
    filters?: ProductFilters
  ): Observable<ProductsResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (filters) {
      if (filters.productName) params = params.set('name', filters.productName);
      if (filters.categoryIds?.length) {
        filters.categoryIds.forEach((id) => {
          params = params.append('categoriesId', id);
        });
      }
      if (filters.minPrice != null) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice != null) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.sortByPrice) params = params.set('sortByPrice', filters.sortByPrice);
      if (filters.craftsmanName) params = params.set('craftsmanName', filters.craftsmanName);
      if (filters.minRating != null) params = params.set('minRating', filters.minRating.toString());
      if (filters.freeShipping) params = params.set('freeShipping', 'true');
      if (filters.craftsmanId) params = params.set('craftsmanId', filters.craftsmanId);
    }

    return this.http.get<ProductsResponse>(`${this.apiUrl}`, { params });
  }

    /**
   * Get a product by ID (Public)
   * @param productId - ID of the product to fetch
   */
  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
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
  updateProduct(id: string, data: UpdateProductDto): Observable<Product> {
    const formData = new FormData();

    if (data.name !== undefined) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.stock !== undefined) formData.append('stock', data.stock.toString());

    // Gérer correctement categoryId (peut être null, undefined ou string)
    if (data.categoryId !== undefined) {
      if (data.categoryId === null || data.categoryId === '') {
        formData.append('categoryId', ''); // Pour supprimer la catégorie
      } else {
        formData.append('categoryId', data.categoryId);
      }
    }

    // Add images to keep
    if (data.imagesToKeep !== undefined && data.imagesToKeep.length > 0) {
      data.imagesToKeep.forEach((url) => {
        formData.append('imagesToKeep[]', url);
      });
    }

    // Add new images
    if (data.images?.length) {
      data.images.forEach((file) => formData.append('images', file));
    }

    return this.http.patch<Product>(`${this.apiUrl}/${id}`, formData, {
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
      productData.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return this.http.post<Product>(`${this.apiUrl}`, formData, {
      withCredentials: true,
    });
  }

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

    return this.http.get<ProductsResponse>(`${this.apiUrl}`, { 
      params,
      withCredentials: true 
    });
  }
}
