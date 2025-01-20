import { Module } from '@nestjs/common';

import { UserApiModule } from './api/user/user.api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './models/entities/database.module';

@Module({
  imports: [DatabaseModule, HealthModule, UserApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
