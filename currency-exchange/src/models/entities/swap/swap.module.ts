import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Swap } from './swap.entity';
import { SwapService } from './swap.service';

@Module({
  imports: [TypeOrmModule.forFeature([Swap])],
  providers: [SwapService],
  exports: [SwapService],
})
export class SwapModule {}
