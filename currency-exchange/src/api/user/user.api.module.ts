import { Module } from '@nestjs/common';
import { UserModule } from 'src/models/entities/user/user.module';

import { UserApiService } from './user.api.service';
import { UserController } from './user.controller';

@Module({
  imports: [UserModule],
  providers: [UserApiService],
  controllers: [UserController],
})
export class UserApiModule {}
