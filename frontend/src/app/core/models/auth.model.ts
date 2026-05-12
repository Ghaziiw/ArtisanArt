import { User } from "./user.model";

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

export interface CreateAdminDto extends ClientSignUpDto {}
