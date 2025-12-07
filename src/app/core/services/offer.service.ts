import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { BASE_URL } from "../../../lib/auth-client";

export interface Offer {
  id: string;
  percentage: number;
  startDate: string;
  endDate: string;
}

@Injectable({ providedIn: 'root',})
export class OfferService{
  private apiUrl = `${BASE_URL}/offers`;

  constructor(private http: HttpClient){}

  getOffer(productId: string): Observable<Offer>{
      return this.http.get<Offer>(`${this.apiUrl}/${productId}`);
  }
}