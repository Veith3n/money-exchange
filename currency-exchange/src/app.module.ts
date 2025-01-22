import { Module } from '@nestjs/common';

import { UserApiModule } from './api/user/user.api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './models/entities/database.module';

@Module({
  imports: [DatabaseModule, HealthModule, UserApiModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
