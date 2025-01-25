import { Module } from '@nestjs/common';

import { ExchangeRateApiModule } from './api/exchange-rate/exchange-rate.api.module';
import { UserApiModule } from './api/user/user.api.module';
import { WalletApiModule } from './api/wallet/wallet.api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './models/entities/database.module';

@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    AuthModule,

    // TODO: extract those to the API module
    ExchangeRateApiModule,
    UserApiModule,
    WalletApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
