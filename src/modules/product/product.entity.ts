import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Category } from 'src/modules/category/category.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column('simple-array', { nullable: true })
  images: string[];

  // Relation Many-to-One avec User (artisan)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'artisanId' })
  artisan: User;

  @Column({ name: 'artisanId' })
  artisanId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
