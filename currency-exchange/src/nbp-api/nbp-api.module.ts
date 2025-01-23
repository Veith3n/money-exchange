import { Module } from '@nestjs/common';

import { NbpApiService } from './nbp-api.sevice';

@Module({
  providers: [NbpApiService],
  exports: [NbpApiService],
})
export class NbpApiModule {}
