import { Product } from "./product.model";

export interface AddToCartDto {
  productId: string;
  quantity?: number;
}

export interface ShoppingCartResponse {
  userId: string;
  quentity: number;
  createdAt: string;
  product: Product;
}

export interface ShoppingCartItem {
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  product: Product;
}

export interface CraftsmanGroup {
  craftsman: {
    id: string;
    businessName: string;
    deliveryPrice: number;
    phone: string;
    workshopAddress: string;
  };
  items: ShoppingCartItem[];
  subtotal: number;
  deliveryPrice: number;
  total: number;
}

export interface GroupedCartResponse {
  craftsmanGroups: CraftsmanGroup[];
  grandTotal: number;
  totalItems: number;
}

export interface UpdateCartDto {
  quantity: number;
}
