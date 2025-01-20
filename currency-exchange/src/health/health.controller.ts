import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { HealthStatusDto } from './dto/health.status.dto';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check health status of the app' })
  @ApiOkResponse({ type: HealthStatusDto, description: 'The health status' })
  checkHealth(): HealthStatusDto {
    return this.healthService.checkHealth();
  }
}
