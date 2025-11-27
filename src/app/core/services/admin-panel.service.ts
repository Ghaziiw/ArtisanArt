import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './auth.service';

export interface UserFilterDto {
  role?: 'admin' | 'client' | 'artisan';
  email?: string;
  name?: string;
  createdAtMin?: string;
  createdAtMax?: string;
}

export interface UserResponse {
  items: User[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AdminPanelService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getAllUsers(filter?: UserFilterDto, page: number = 1, limit: number = 100) {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = (filter as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<UserResponse>(this.apiUrl, { params, withCredentials: true });
  }

  deleteUser(userId: string) {
    return this.http.delete<any>(this.apiUrl + `/${userId}`, { withCredentials: true });
  }
}
