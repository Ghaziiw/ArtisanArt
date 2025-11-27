import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Offer {
  id: string;
  percentage: number;
  startDate: string;
  endDate: string;
}

@Injectable({ providedIn: 'root',})
export class OfferService{
    private apiUrl="http://localhost:3000/offers";
    constructor(private http: HttpClient){}

    getOffer(productId: string): Observable<Offer>{
        return this.http.get<Offer>(`${this.apiUrl}/${productId}`);
    }

}