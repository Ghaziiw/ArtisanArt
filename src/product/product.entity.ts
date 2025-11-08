import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CategoryEntity } from 'src/category/category.entity';

@Entity({ name: 'products' })
export class ProductEntity {
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

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Column('simple-array', { nullable: true })
  images: string[];

  // Relation Many-to-One avec UserEntity (artisan)
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'artisanId' })
  artisan: UserEntity;

  @Column({ name: 'artisanId' })
  artisanId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
