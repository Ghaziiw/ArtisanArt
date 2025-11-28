export interface Craftsman {
  userId: string;
  businessName: string;
  bio: string;
  specialty: string;
  phone: string;
  workshopAddress: string;
  instagram?: string;
  facebook?: string;
  expirationDate: string | null;
  deliveryPrice: string;
  profileImage: string | null;
  avgRating: number;
  totalComments: number;
}

export interface CraftsmenResponse {
  items: Craftsman[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
