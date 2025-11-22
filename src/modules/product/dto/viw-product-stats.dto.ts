import { CraftsmanWithStats } from 'src/modules/craftsman/dto/view-craftsman-stats.dto';
import { Product } from '../product.entity';

export type ProductWithStats = Product & {
  avgRating: number;
  totalComments: number;
  craftsman: CraftsmanWithStats;
};
