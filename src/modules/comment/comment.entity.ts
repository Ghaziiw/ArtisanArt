import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';

import { UserEntity } from 'src/modules/user/user.entity';
import { ProductEntity } from 'src/modules/product/product.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  content: string;

  @Check(`"mark" BETWEEN 1 AND 5`)
  @Column({ nullable: false })
  mark: number;

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
}
