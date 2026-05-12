import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import type { Product } from '../product/product.entity';
import { IsUUID, Max, Min } from 'class-validator';
@Entity('offers')
export class Offer {
  @PrimaryColumn('uuid')
  @IsUUID()
  productId: string;

  @OneToOne('Product', (product: Product) => product.offer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  @Min(0, { message: 'Percentage must be at least 0' })
  @Max(100, { message: 'Percentage cannot exceed 100' })
  percentage: number;

  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;
}
