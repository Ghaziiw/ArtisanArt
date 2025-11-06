/**
 * Interface representing the authenticated user.
 */
export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'artisan' | 'client';
}
