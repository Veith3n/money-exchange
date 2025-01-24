import { Module } from '@nestjs/common';
import { NbpApiModule } from 'src/nbp-api/nbp-api.module';

import { WalletModule } from '../../models/entities/wallet/wallet.module';
import { ExchangeRateApiService } from './exchange-rate.api.service';
import { ExchangeRateController } from './exchange-rate.controller';

@Module({
  imports: [NbpApiModule, WalletModule],
  providers: [ExchangeRateApiService],
  controllers: [ExchangeRateController],
})
export class ExchangeRateApiModule {}
