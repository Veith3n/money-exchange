import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyCode } from 'src/types/currency-codes.enum';
import { Repository } from 'typeorm/repository/Repository';

import { Wallet } from './wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
  ) {}

  public async findOrCreateForUserAndCurrencyCode(
    userId: number,
    currencyCode: CurrencyCode,
  ): Promise<Wallet> {
    let wallet = await this.walletRepo.findOneBy({ userId, currencyCode });

    if (!wallet) {
      wallet = this.walletRepo.create({ userId, currencyCode, balance: '0' });
      wallet = await this.walletRepo.save(wallet);
    }

    return wallet;
  }

  public save(wallet: Wallet): Promise<Wallet> {
    return this.walletRepo.save(wallet);
  }

  public async getAllForUser(userId: number): Promise<Wallet[]> {
    return this.walletRepo.findBy({ userId });
  }
}
