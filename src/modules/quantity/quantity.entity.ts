import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  Check,
  JoinColumn,
} from 'typeorm';
import { Order } from 'src/modules/order/order.entity';
import { ProductEntity } from 'src/modules/product/product.entity';

@Entity('quantity')
@Unique(['order', 'product'])
export class Quantity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => ProductEntity, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Check(`"quantity" > 0`)
  @Column()
  quantity: number;
}
