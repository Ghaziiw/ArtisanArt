import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriesResponse, Category } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  /**
   * Fetches a paginated list of categories from the API.
   * @param page - Page number (default: 1)
   * @param limit - Number of items per page (default: 20)
   * @returns Observable with categories response
   */
  getCategories(page: number = 1, limit: number = 20): Observable<CategoriesResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<CategoriesResponse>(`${this.apiUrl}`, { params });
  }

  /**
   * Creates a new category (Admin only).
   * @param name - Name of the category
   * @returns Observable with the created category
   */
  createCategory(name: string): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}`, { name }, { withCredentials: true });
  }

  /**
   * Deletes a category by ID (Admin only).
   * @param categoryId - ID of the category to delete
   * @returns Observable<void>
   */
  deleteCategory(categoryId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${categoryId}`, { withCredentials: true });
  }
}