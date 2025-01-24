import { CurrencyCode } from 'src/types/currency-codes.enum';
import { Column } from 'typeorm/decorator/columns/Column';
import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { UpdateDateColumn } from 'typeorm/decorator/columns/UpdateDateColumn';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { Index } from 'typeorm/decorator/Index';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';

import { User } from '../user/user.entity';

@Entity()
@Index('wallet__user_id_currency_code_unique', ['userId', 'currencyCode'], {
  unique: true,
})
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => User, (user) => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'user_id' })
  @Index('wallet__userid')
  userId: number;

  @Column({ name: 'currency_code' })
  @Index('wallet__currency_code')
  currencyCode: CurrencyCode;

  @Column()
  balance: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  public topUp(amount: number): void {
    const currentBalance = parseFloat(this.balance);

    this.balance = (currentBalance + amount).toString();
  }

  public withdraw(amount: number): void {
    const currentBalance = parseFloat(this.balance);

    this.balance = (currentBalance - amount).toString();
  }
}
