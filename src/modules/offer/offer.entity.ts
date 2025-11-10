import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ProductEntity } from '../product/product.entity';
@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  percentage: number;

  @Column({ type: 'date', nullable: true })
  start_date?: Date;

  @Column({ type: 'date', nullable: true })
  end_date?: Date;

  @OneToOne(() => ProductEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;
}
