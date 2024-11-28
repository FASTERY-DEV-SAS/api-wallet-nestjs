import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('apikeys')
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.apiKeys)
  user: User;

  @Column('simple-array', { nullable: true })
  allowedIps: string[];
}
