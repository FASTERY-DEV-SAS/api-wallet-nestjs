import { User } from 'src/auth/entities/user.entity';
import { Transfer } from 'src/transfers/entities/transfer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'wallets' })
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'text', default: 'USD' })
  currency: string;

  @Column({ type: 'text' })
  description: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  balance: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({ type: 'text' })
  type: string;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @OneToMany(() => Transfer, (transfers) => transfers.wallet)
  transfers: Transfer[];
}
