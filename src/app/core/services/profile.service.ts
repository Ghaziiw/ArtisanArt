import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService, User } from './auth.service';

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  location?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export type ProfileUpdateResponse = User;

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/users/profile';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Updates user profile information (name, email, location, image URL)
   */
  updateProfile(data: UpdateProfileDto): Observable<ProfileUpdateResponse> {
    return this.http.patch<ProfileUpdateResponse>(
      `${this.apiUrl}/me`,
      data,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        // Update the user in AuthService after successful profile update
        if (response) {
          this.authService['userSubject'].next(response);
        }
      })
    );
  }

  /**
   * Uploads a profile image file
   */
  updateProfileImage(imageFile: File): Observable<ProfileUpdateResponse> {
    const formData = new FormData();
    formData.append('profileImage', imageFile);

    return this.http.patch<ProfileUpdateResponse>(
      `${this.apiUrl}/me/image`,
      formData,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        // Update the user in AuthService after successful image upload
        if (response) {
          this.authService['userSubject'].next(response);
        }
      })
    );
  }

  /**
   * Changes the user's password
   */
  changePassword(data: ChangePasswordDto): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.apiUrl}/password`,
      data,
      { withCredentials: true }
    );
  }

  /**
   * Deletes the user's profile image
   */
  deleteProfileImage(): Observable<ProfileUpdateResponse> {
    return this.http.delete<ProfileUpdateResponse>(
      `${this.apiUrl}/me/image`,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        // Update the user in AuthService after successful image deletion
        if (response) {
          this.authService['userSubject'].next(response);
        }
      })
    );
  }
}