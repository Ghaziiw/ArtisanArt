import { ShoppingCart } from '../shoppingcart.entity';

export interface ArtisanCartGroup {
  artisan: {
    id: string;
    businessName: string;
    deliveryPrice: number;
    phone: string;
    workshopAddress: string;
  };
  items: ShoppingCart[];
  subtotal: number;
  deliveryPrice: number;
  total: number;
}
