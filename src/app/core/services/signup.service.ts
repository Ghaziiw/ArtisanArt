import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClientSignUpDto {
  email: string;
  password: string;
  name: string;
  location?: string;
}

export interface CraftsmanSignUpDto {
  email: string;
  password: string;
  name: string;
  location?: string;
  businessName: string;
  bio?: string;
  specialty?: string;
  phone: string;
  workshopAddress: string;
  deliveryPrice: number;
  instagram?: string;
  facebook?: string;
  profileImage?: File;
}

export interface ClientSignUpResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    image: string | null;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CraftsmanSignUpResponse {
  userId: string;
  businessName: string;
  bio?: string;
  specialty?: string;
  phone: string;
  workshopAddress: string;
  instagram?: string;
  facebook?: string;
  deliveryPrice: number;
  profileImage?: string;
  expirationDate: string | null;
  user: {
    id: string;
    email: string;
    name: string;
    image: string | null;
    location?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Sign up a client
   */
  signUpClient(data: ClientSignUpDto): Observable<ClientSignUpResponse> {
    return this.http.post<ClientSignUpResponse>(`${this.apiUrl}/api/auth/sign-up/email`, data, {
      withCredentials: true,
    });
  }

  /**
   * Sign up a craftsman
   */
  signUpCraftsman(data: CraftsmanSignUpDto): Observable<CraftsmanSignUpResponse> {
    const formData = new FormData();

    // Required fields
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('name', data.name);
    formData.append('businessName', data.businessName);
    formData.append('phone', data.phone);
    formData.append('workshopAddress', data.workshopAddress);
    formData.append('deliveryPrice', data.deliveryPrice.toString());

    // Optional fields
    if (data.location) formData.append('location', data.location);
    if (data.bio) formData.append('bio', data.bio);
    if (data.specialty) formData.append('specialty', data.specialty);
    if (data.instagram) formData.append('instagram', data.instagram);
    if (data.facebook) formData.append('facebook', data.facebook);

    // Profile image file
    if (data.profileImage) {
      formData.append('profileImage', data.profileImage);
    }

    return this.http.post<CraftsmanSignUpResponse>(`${this.apiUrl}/craftsmen`, formData, {
      withCredentials: true,
    });
  }
}
