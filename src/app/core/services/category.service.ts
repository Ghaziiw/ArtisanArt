import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriesResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
    * Fetches a paginated list of categories from the API.
   */
  getCategories(page: number = 1, limit: number = 20): Observable<CategoriesResponse> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    return this.http.get<CategoriesResponse>(`${this.apiUrl}/categories`, { params });
  }
}
