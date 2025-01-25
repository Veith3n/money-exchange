import { Injectable } from '@nestjs/common';
import { User } from 'src/models/entities/user/user.entity';

import { Swap } from '../../models/entities/swap/swap.entity';
import { SwapService } from '../../models/entities/swap/swap.service';
import { SwapDto } from './dto/swap.dto';

@Injectable()
export class SwapApiService {
  constructor(private readonly swapService: SwapService) {}

  public async getSwaps(userId: User['id']): Promise<SwapDto[]> {
    const wallets = await this.swapService.getAllForUser(userId);

    return wallets.map(this.mapSwapToDto);
  }

  private mapSwapToDto(swap: Swap): SwapDto {
    return {
      userId: swap.userId,
      boughtCurrencyCode: swap.boughtCurrencyCode,
      boughtCurrencyValue: swap.boughtCurrencyValue,
      soldCurrencyCode: swap.soldCurrencyCode,
      soldCurrencyValue: swap.soldCurrencyValue,
      exchangeRate: swap.exchangeRate,
    };
  }
}
