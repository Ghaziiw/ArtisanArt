import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { BASE_URL } from "../../../lib/auth-client";
import { Offer } from "../models";

@Injectable({ providedIn: 'root',})
export class OfferService{
  private apiUrl = `${BASE_URL}/offers`;

  constructor(private http: HttpClient){}

  getOffer(productId: string): Observable<Offer>{
    return this.http.get<Offer>(`${this.apiUrl}/${productId}`);
  }

  /**
   * Create a new offer for a product
   */
  createOffer(productId: string, percentage: number): Observable<Offer> {

    const today = new Date();
    const oneYearAfter = new Date();
    oneYearAfter.setFullYear(oneYearAfter.getFullYear() + 1);

    const payload = {
      productId,
      percentage,
      startDate: today.toISOString().split("T")[0],
      endDate: oneYearAfter.toISOString().split("T")[0],
    };

    return this.http.post<Offer>(`${this.apiUrl}`, payload, { withCredentials: true});
  }

  /**
   * Update an existing offer
   */
  updateOffer(productId: string, percentage: number ): Observable<Offer> {

    const payload = { percentage };

    return this.http.patch<Offer>(`${this.apiUrl}/${productId}`, payload, { withCredentials: true });
  }

    /**
   * Delete an existing offer
   */
  deleteOffer(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`, {
      withCredentials: true
    });
  }
}