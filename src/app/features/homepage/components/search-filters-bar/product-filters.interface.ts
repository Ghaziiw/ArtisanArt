export interface ProductFilters {
  productName?: string;
  craftsmanName?: string;
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  freeShipping?: boolean;
  sortByPrice?: 'asc' | 'desc';
}
