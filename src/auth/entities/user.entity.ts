import { Category } from 'src/categories/entities/category.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiKey } from './apikey.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column('text', { unique: true })
  userName: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => ApiKey, (apiKey) => apiKey.user, {nullable: true})
  apiKeys: ApiKey[];

  @CreateDateColumn({})
  createAt: Date;

  @UpdateDateColumn({})
  updateAt: Date;

  @OneToMany(() => Wallet, (wallets) => wallets.user)
  wallets: Wallet[];

  @OneToMany(() => Category, (categories) => categories.user)
  categories: Category[];

  @BeforeInsert()
  checkEmailInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkEmailUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
