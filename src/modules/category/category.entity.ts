import { MinLength } from 'class-validator';
import { Product } from '../product/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
