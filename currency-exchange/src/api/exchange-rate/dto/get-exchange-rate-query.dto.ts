import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsOptional } from 'class-validator';
import { CurrencyCode } from 'src/types/currency-codes.enum';

export class GetExchangeRateQueryDto {
  @ApiProperty({ enum: CurrencyCode })
  @IsEnum(CurrencyCode)
  currencyCode: CurrencyCode;

  @ApiProperty({ required: false, description: 'Date in ISO 8601 format' })
  @IsOptional()
  @IsISO8601()
  iso8601Date?: string;
}
