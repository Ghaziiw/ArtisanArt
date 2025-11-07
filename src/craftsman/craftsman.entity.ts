import { UserEntity } from 'src/user/user.entity';
import { Entity, Column, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('craftsmen')
export class CraftsmanEntity {
  // Foreign key relation one-to-one with User
  @OneToOne(() => UserEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  // @Column('text') // Foreign key column
  @PrimaryColumn('text')
  userId: string;

  // Craftsman profile information
  @Column({ nullable: false })
  businessName: string;

  @Column('text', { nullable: true })
  bio: string;

  @Column({ nullable: true })
  specialty: string; // Ex: "Poterie", "Bijouterie", "Textile"

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  workshopAddress: string;

  // Social media
  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ type: 'timestamp', nullable: true })
  expirationDate: Date;

  @Column({ type: 'decimal', nullable: true })
  deliveryPrice: number;

  @Column({ nullable: true })
  profileImage: string;
}
