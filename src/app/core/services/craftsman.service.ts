import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Craftsman, CraftsmenResponse } from '../models';
import { BASE_URL } from '../../../lib/auth-client';

@Injectable({
  providedIn: 'root',
})
export class CraftsmanService {
  private apiUrl = `${BASE_URL}/craftsmen`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches a craftsman's details by ID
   */
  getCraftsmanById(craftsmanId: string): Observable<Craftsman> {
    return this.http.get<Craftsman>(`${this.apiUrl}/${craftsmanId}`);
  }

  /**
   * Fetches the profile of the authenticated craftsman
   */
  getMyProfile(): Observable<Craftsman> {
    return this.http.get<Craftsman>(`${this.apiUrl}/profile/me`, {
      withCredentials: true,
    });
  }

  /** 
   * Fetches all craftsmen
   */
  getAllCraftsmen(): Observable<CraftsmenResponse> {
    return this.http.get<CraftsmenResponse>(this.apiUrl);
  }

    /**
   * Updates the expiration date of a craftsman
   */
  updateExpirationDate(craftsmanId: string, newExpDate: string | null): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${craftsmanId}/exp`,
      { newExpDate },
      { withCredentials: true }
    );
  }
}
