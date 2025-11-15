import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Category } from 'src/modules/category/category.entity';
import { IsUUID, Min } from 'class-validator';
import type { Offer } from '../offer/offer.entity';
import { Exclude } from 'class-transformer'; // To exclude relations from serialization
import { Craftsman } from '../craftsman/craftsman.entity';
import { Comment } from '../comment/comment.entity';

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
    eager: false,
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
  @ManyToOne(() => Craftsman, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'craftsmanId' })
  craftsman?: Craftsman;

  @Column({ name: 'craftsmanId' })
  @IsUUID()
  craftsmanId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne('Offer', (offer: Offer) => offer.product)
  offer?: Offer;

  @OneToMany(() => Comment, (comment) => comment.product, { eager: false })
  comments: Comment[];
}
