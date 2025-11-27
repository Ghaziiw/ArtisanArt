import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from './specific-product.service';
import { User } from './specific-product.service';

export interface createCommentDto{
    productId: string;
    content: string;
    mark: number;
}

export interface CommentsResponse {
  items: Comment[];
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
    getComments(
        productId: string,
        page: number =1,
        limit : number = 20
    ): Observable<CommentsResponse>{
        let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
        return this.http.get<CommentsResponse>(`${this.apiUrl}/${productId}`, { params });
    }


    addComment(commentData: createCommentDto): Observable<Comment> {
      return this.http.post<Comment>(
    `${this.apiUrl}`,
    commentData,  
    { withCredentials: true }
  );
}



}