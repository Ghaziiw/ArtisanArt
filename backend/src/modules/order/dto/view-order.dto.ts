import { Craftsman } from 'src/modules/craftsman/craftsman.entity';
import { Order } from '../order.entity';

export interface ViewOrderDto {
  order: Order;
  craftsman: Craftsman;
}
