import { Product } from "./product.model";

export interface CreateOrderDto {
  cin: string;
  location: string;
  state: TunisianState;
  phone: string;
}

export interface OrderItem {
  productId: string;
  orderId: string;
  quantity: number;
  priceAtOrder: string;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatusRequest;
  createdAt: string;
  cin: string;
  location: string;
  state: string;
  phone: string;
  deliveryPrice: string;
  items: OrderItem[];
  user: {
    email: string;
    name: string;
  };
}

export interface OrdersResponse {
  items: Order[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: string;
    totalPages: number;
    currentPage: string;
  };
}

export enum OrderStatusRequest {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum TunisianState {
  TUNIS = 'TUNIS',
  ARIANA = 'ARIANA',
  BEN_AROUS = 'BEN_AROUS',
  MANOUBA = 'MANOUBA',
  NABEUL = 'NABEUL',
  ZAGHOUAN = 'ZAGHOUAN',
  BIZERTE = 'BIZERTE',
  BEJA = 'BEJA',
  JENDOUBA = 'JENDOUBA',
  LE_KAIRAOUAN = 'LE_KAIRAOUAN',
  KASSERINE = 'KASSERINE',
  SFAX = 'SFAX',
  SIDI_BOUZID = 'SIDI_BOUZID',
  SOUSSE = 'SOUSSE',
  MONASTIR = 'MONASTIR',
  MAHDIA = 'MAHDIA',
  GABES = 'GABES',
  MEDENINE = 'MEDENINE',
  TATAOUINE = 'TATAOUINE',
  TOZEUR = 'TOZEUR',
  KEBILI = 'KEBILI',
}
