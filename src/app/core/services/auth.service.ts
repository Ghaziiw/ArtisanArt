import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { authClient } from '../../../lib/auth-client';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: string;
  location: string;
}

export interface Session {
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
  id: string;
}

export interface SessionResponse {
  session: Session;
  user: User;
}

export interface LoginResponse {
  token: string;
  user: User;
  redirect: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  // Observable for user and session state
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  // Observable for session state
  private sessionSubject = new BehaviorSubject<Session | null>(null);
  public session$ = this.sessionSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSession();
  }

  /**
   * Fetches the current session from the API.
   */
  getSession(): Observable<SessionResponse | null> {
    return this.http.get<SessionResponse>(`${this.apiUrl}/get-session`, {
      withCredentials: true, // <- envoie le cookie automatiquement
    }).pipe(
      tap((response) => {
        if (response?.user && response?.session) {
          this.userSubject.next(response.user);
          this.sessionSubject.next(response.session);
        } else {
          this.userSubject.next(null);
          this.sessionSubject.next(null);
        }
      }),
      catchError(err => {
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
    await authClient.signIn.email({
        email: email,
        password: password
    });
  }
}
