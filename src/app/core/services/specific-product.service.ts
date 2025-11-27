import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface SpecificProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  categoryId: string;
  images: string[];
  craftsmanId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  craftsman: Craftsman;
  comments: Comment[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Craftsman {
  userId: string;
  businessName: string;
  bio: string;
  specialty: string;
  phone: string;
  workshopAddress: string;
  instagram: string;
  facebook: string;
  expirationDate: string;
  deliveryPrice: string;
  profileImage: string;
}

export interface Comment {
  id: string;
  content: string;
  mark: number;
  userId: string;
  productId: string;
  createdAt: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  image: string | null;
  location: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}


@Injectable({ providedIn: 'root',})
export class SpecificProductService{
    private apiUrl="http://localhost:3000/products";
    constructor(private http: HttpClient){}

    getProductById(productId: string): Observable<SpecificProduct>{
        return this.http.get<SpecificProduct>(`${this.apiUrl}/${productId}`);
    }

}