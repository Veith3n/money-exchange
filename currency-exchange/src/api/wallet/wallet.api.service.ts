import { Injectable } from '@nestjs/common';
import { User } from 'src/models/entities/user/user.entity';
import { Wallet } from 'src/models/entities/wallet/wallet.entity';
import { WalletService } from 'src/models/entities/wallet/wallet.service';
import { CurrencyCode } from 'src/types/currency-codes.enum';

import { WalletDto } from './dto/wallet.dto';

@Injectable()
export class WalletApiService {
  constructor(private readonly walletService: WalletService) {}

  public async getWallets(userId: User['id']): Promise<WalletDto[]> {
    const wallets = await this.walletService.getAllForUser(userId);

    return wallets.map(this.mapWalletToDto);
  }

  public async topUp(
    userId: User['id'],
    currencyCode: CurrencyCode,
    amount: number,
  ): Promise<WalletDto> {
    const wallet = await this.walletService.findOrCreateForUserAndCurrencyCode(
      userId,
      currencyCode,
    );

    wallet.topUp(amount);

    const updatedWallet = await this.walletService.save(wallet);

    return this.mapWalletToDto(updatedWallet);
  }

  private mapWalletToDto(wallet: Wallet): WalletDto {
    return {
      currencyCode: wallet.currencyCode,
      balance: wallet.balance,
    };
  }
}
