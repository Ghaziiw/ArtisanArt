import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { IsUUID, Max, Min } from 'class-validator';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ nullable: false })
  @Min(1, { message: 'Mark must be at least 1' })
  @Max(5, { message: 'Mark cannot exceed 5' })
  mark: number;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'userId' })
  @IsUUID()
  userId: string;

  @ManyToOne(() => Product, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ name: 'productId' })
  @IsUUID()
  productId: string;

  @CreateDateColumn()
  createdAt: Date;
}
