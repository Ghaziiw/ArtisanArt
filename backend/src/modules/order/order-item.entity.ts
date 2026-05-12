import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { Min } from 'class-validator';
import { Order } from './order.entity';

@Entity('orderItems')
export class OrderItem {
  @PrimaryColumn('uuid', { name: 'productId' })
  productId: string;

  @PrimaryColumn('uuid', { name: 'orderId' })
  orderId: string;

  @ManyToOne(() => Order, 'items', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtOrder: number;
}
