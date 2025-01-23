import { Module } from '@nestjs/common';
import { WalletModule } from 'src/models/entities/wallet/wallet.module';

import { WalletApiService } from './wallet.api.service';
import { WalletController } from './wallet.controller';

@Module({
  imports: [WalletModule],
  providers: [WalletApiService],
  controllers: [WalletController],
})
export class WalletApiModule {}
