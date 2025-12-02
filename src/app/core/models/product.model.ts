import { ProductComment } from "./comment.model";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: { id: string; name: string } | null;
  images: string[] | null;
  craftsman: {
    userId: string;
    businessName: string;
    workshopAddress: string;
    profileImage: string | null;
    avgRating: number;
    totalComments: number;
  };
  offer: { percentage: number } | null;
  avgRating: number;
  totalComments: number;
  comments: ProductComment[] | null;
}

export interface ProductsResponse {
  items: Product[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId?: string;
  images?: File[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string | null;
  images?: File[];
  imagesToKeep?: string[];
}

export interface ProductFilters {
  productName?: string;
  craftsmanName?: string;
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  freeShipping?: boolean;
  sortByPrice?: 'asc' | 'desc';
  craftsmanId?: string;
}

