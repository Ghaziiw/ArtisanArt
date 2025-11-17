import { Product } from '../product.entity';

export type ProductWithStats = Product & {
  avgRating: number;
  totalComments: number;
};
