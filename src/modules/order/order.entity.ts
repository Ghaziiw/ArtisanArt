import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Check,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/user/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  order_date: Date;

  @Column({ nullable: true })
  location?: string;

  @Column({ length: 15, nullable: true })
  cin?: string;

  @Check(`"status" BETWEEN 0 AND 3`)
  @Column({ default: 0, nullable: false })
  status: number; // 0-3

  @ManyToOne(() => UserEntity, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
