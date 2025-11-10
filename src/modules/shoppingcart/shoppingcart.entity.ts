import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  Check,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ProductEntity } from 'src/modules/product/product.entity';

@Entity('shoppingcarts')
export class ShoppingCart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Unique(['user', 'product'])
  @ManyToOne(() => UserEntity, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => ProductEntity, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Check(`"quantity" > 0`)
  @Column({ default: 1, nullable: false })
  quantity: number;
}
