import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user', synchronize: false }) // Name exact of the Better Auth table, synchronize: false to avoid conflicts
export class User {
  @PrimaryColumn('text')
  id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  role: 'admin' | 'artisan' | 'client';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
