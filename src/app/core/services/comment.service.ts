import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductComment } from '../models';

export interface createCommentDto{
  productId: string;
  content: string;
  mark: number;
}

export interface CommentsResponse {
  items: ProductComment[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

@Injectable({providedIn: 'root'})
export class CommentService{
  private apiUrl = 'http://localhost:3000/comments';

  constructor(private http: HttpClient) {}

  /**
   * Fetches a paginated list of comments for a specific product from the API.
   */
  getComments(
      productId: string,
      page: number =1,
      limit : number = 20
  ): Observable<CommentsResponse>{
      let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
      return this.http.get<CommentsResponse>(`${this.apiUrl}/${productId}`, { params });
  }

  /**
   * Adds a new comment for a specific product.
   */
  addComment(commentData: createCommentDto): Observable<ProductComment> {
    return this.http.post<ProductComment>(
      `${this.apiUrl}`,
      commentData,  
      { withCredentials: true }
    );
  }
}