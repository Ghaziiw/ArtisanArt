export interface Category {
  id: string;
  name: string;
}

export interface CategoriesResponse {
  items: Category[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
