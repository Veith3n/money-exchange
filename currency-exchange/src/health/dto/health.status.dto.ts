import { ApiProperty } from '@nestjs/swagger';

export class HealthStatusDto {
  @ApiProperty({
    example: 'UP',
    description: 'The health status of the service',
  })
  status: string;
}
