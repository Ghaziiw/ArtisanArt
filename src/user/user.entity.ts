import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'user' }) // Name exact of the Better Auth table
export class UserEntity {
  @PrimaryColumn('uuid')
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
}
