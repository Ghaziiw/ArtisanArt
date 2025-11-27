import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { authClient } from '../../../lib/auth-client';
import { ClientSignUpDto, ClientSignUpResponse, CraftsmanSignUpDto, CraftsmanSignUpResponse, Session, SessionResponse, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  // Observable for user and session state
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  // Observable for session state
  private sessionSubject = new BehaviorSubject<Session | null>(null);
  public session$ = this.sessionSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSession();
  }

  get currentUser() {
    return this.userSubject.value;
  }

  /**
   * Fetches the current session from the API.
   */
  getSession(): Observable<SessionResponse | null> {
    return this.http
      .get<SessionResponse>(`${this.apiUrl}/api/auth/get-session`, {
        withCredentials: true, // <- envoie le cookie automatiquement
      })
      .pipe(
        tap((response) => {
          if (response?.user && response?.session) {
            this.userSubject.next(response.user);
            this.sessionSubject.next(response.session);
          } else {
            this.userSubject.next(null);
            this.sessionSubject.next(null);
          }
        }),
        catchError((err) => {
          console.error('Failed to load session:', err);
          this.userSubject.next(null);
          this.sessionSubject.next(null);
          return of(null);
        })
      );
  }

  /**
   * Loads the session on service initialization.
   */
  loadSession(): void {
    if (typeof window === 'undefined') return; // éviter SSR
    this.getSession().subscribe();
  }

  /**
   * Logs out the current user.
   */
  async logout() {
    this.userSubject.next(null);
    this.sessionSubject.next(null);
    await authClient.signOut();
  }

  /**
   * Logs in a user with email and password.
   */
  async login(email: string, password: string) {
    const res = await authClient.signIn.email({ email, password });
    if (res.data) {
      this.getSession().subscribe();
    }
    return res.data || res.error; // renvoie soit Data soit Error
  }

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
