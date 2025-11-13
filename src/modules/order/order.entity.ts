import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { IsEnum, IsString, Length, Matches } from 'class-validator';
import { OrderStatus } from './enums/order-status.enum';
import { TunisianState } from './enums/tunisian-state.enum';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @OneToMany('OrderItem', 'order', { cascade: true, eager: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'char', length: 8, nullable: false })
  @IsString()
  @Length(8, 8, { message: 'CIN must be exactly 8 characters' })
  @Matches(/^\d{8}$/, { message: 'CIN must contain only digits' })
  cin: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsString()
  @Length(1, 255, { message: 'Location must be between 1 and 255 characters' })
  location: string;

  @IsEnum(TunisianState, { message: 'Invalid state' })
  state: TunisianState;

  @Column({ type: 'varchar', length: 8, nullable: false })
  @IsString()
  @Matches(/^[1-9][0-9]{7}$/, {
    message: 'Phone number must be exactly 8 digits and cannot start with 0',
  })
  phone: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  deliveryPrice: number;
}
