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

export interface UserFilterDto {
  role?: 'admin' | 'client' | 'artisan';
  email?: string;
  name?: string;
  createdAtMin?: string;
  createdAtMax?: string;
}

export interface UserResponse {
  items: User[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

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
