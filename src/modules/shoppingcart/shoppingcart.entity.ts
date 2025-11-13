import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { IsUUID, Min } from 'class-validator';
import { Exclude } from 'class-transformer'; // To exclude relations from serialization

@Entity('shoppingCarts')
export class ShoppingCart {
  @PrimaryColumn('uuid', { name: 'userId' })
  @IsUUID()
  userId: string;

  @PrimaryColumn('uuid', { name: 'productId' })
  @IsUUID()
  productId: string;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  @Exclude()
  user: User;

  @ManyToOne(() => Product, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ default: 1, nullable: false })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
