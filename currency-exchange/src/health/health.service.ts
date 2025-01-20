import { Injectable } from '@nestjs/common';

import { HealthStatusDto } from './dto/health.status.dto';

@Injectable()
export class HealthService {
  checkHealth(): HealthStatusDto {
    return { status: 'UP' };
  }
}
