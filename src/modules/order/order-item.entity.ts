import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { Min } from 'class-validator';

@Entity('orderItems')
export class OrderItem {
  @PrimaryColumn('uuid', { name: 'productId' })
  productId: string;

  @PrimaryColumn('uuid', { name: 'orderId' })
  orderId: string;

  @ManyToOne('Order', 'items', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: any;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
