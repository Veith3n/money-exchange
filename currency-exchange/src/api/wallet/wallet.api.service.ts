import { Injectable } from '@nestjs/common';
import { User } from 'src/models/entities/user/user.entity';
import { Wallet } from 'src/models/entities/wallet/wallet.entity';
import { WalletService } from 'src/models/entities/wallet/wallet.service';

import { WalletDto } from './dto/wallet.dto';

@Injectable()
export class WalletApiService {
  constructor(private readonly walletService: WalletService) {}

  public async getWallets(userId: User['id']): Promise<WalletDto[]> {
    const wallets = await this.walletService.getAllForUser(userId);

    return wallets.map(this.mapWalletToDto);
  }

  private mapWalletToDto(wallet: Wallet): WalletDto {
    return {
      currencyCode: wallet.currencyCode,
      balance: wallet.balance,
    };
  }
}
