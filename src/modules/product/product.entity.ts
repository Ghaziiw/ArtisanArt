import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Category } from 'src/modules/category/category.entity';
import { IsUUID, Min } from 'class-validator';
import type { Offer } from '../offer/offer.entity';
import { Exclude } from 'class-transformer'; // To exclude relations from serialization

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Min(0, { message: 'Price must be at least 0' })
  price: number;

  @Column({ default: 0 })
  @Min(0, { message: 'Stock must be at least 0' })
  stock: number;

  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ name: 'categoryId', nullable: true })
  @IsUUID()
  categoryId: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  // Relation Many-to-One avec User (artisan)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'artisanId' })
  @Exclude()
  artisan: User;

  @Column({ name: 'artisanId' })
  @IsUUID()
  artisanId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne('Offer', (offer: Offer) => offer.product)
  offer: Offer;
}
