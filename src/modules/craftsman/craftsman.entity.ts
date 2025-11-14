import { IsString, Matches } from 'class-validator';
import { User } from 'src/modules/user/user.entity';
import { Entity, Column, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('craftsmen')
export class Craftsman {
  // Foreign key relation one-to-one with User
  @OneToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // @Column('text') // Foreign key column
  @PrimaryColumn('text')
  userId: string;

  // Craftsman profile information
  @Column({ nullable: false })
  businessName: string;

  @Column('text', { nullable: true })
  bio?: string;

  @Column({ nullable: true })
  specialty?: string; // Ex: "Poterie", "Bijouterie", "Textile"

  @Column({ type: 'varchar', length: 8, nullable: false })
  @IsString()
  @Matches(/^[1-9][0-9]{7}$/, {
    message: 'Phone number must be exactly 8 digits and cannot start with 0',
  })
  phone: string;

  @Column({ nullable: false })
  workshopAddress: string;

  // Social media
  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  facebook?: string;

  @Column({ type: 'timestamp', nullable: true })
  expirationDate?: Date | null;

  @Column({ type: 'decimal', nullable: false })
  deliveryPrice: number;

  @Column({ nullable: true })
  profileImage?: string;
}
