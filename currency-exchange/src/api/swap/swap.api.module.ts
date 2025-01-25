import { Module } from '@nestjs/common';

import { SwapModule } from '../../models/entities/swap/swap.module';
import { SwapApiService } from './swap.api.service';
import { SwapController } from './swap.controller';

@Module({
  imports: [SwapModule],
  providers: [SwapApiService],
  controllers: [SwapController],
})
export class SwapApiModule {}
