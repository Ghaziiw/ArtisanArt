import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Craftsman {
  userId: string;
  businessName: string;
  bio: string;
  specialty: string;
  phone: string;
  workshopAddress: string;
  instagram?: string;
  facebook?: string;
  expirationDate: string;
  deliveryPrice: string;
  profileImage: string | null;
  avgRating: number;
  totalComments: number;
}

@Injectable({
  providedIn: 'root',
})
export class CraftsmanService {
  private apiUrl = 'http://localhost:3000/craftsmen';

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
  getAllCraftsmen(): Observable<Craftsman[]> {
    return this.http.get<Craftsman[]>(this.apiUrl);
  }
}
