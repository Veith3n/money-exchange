import { CurrencyCode } from 'src/types/currency-codes.enum';
import { Column } from 'typeorm/decorator/columns/Column';
import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { Index } from 'typeorm/decorator/Index';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';

import { User } from '../user/user.entity';

@Entity()
export class Swap {
  @PrimaryGeneratedColumn()
  id: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'user_id' })
  @Index('swap__userid')
  userId: number;

  @Column({ name: 'bought_currency_code' })
  boughtCurrencyCode: CurrencyCode;

  @Column({ name: 'bought_currency_value', type: 'double precision' })
  boughtCurrencyValue: number;

  @Column({ name: 'sold_currency_code' })
  soldCurrencyCode: CurrencyCode;

  @Column({ name: 'sold_currency_value', type: 'double precision' })
  soldCurrencyValue: number;

  @Column({ name: 'exchange_rate', type: 'double precision' })
  exchangeRate!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
