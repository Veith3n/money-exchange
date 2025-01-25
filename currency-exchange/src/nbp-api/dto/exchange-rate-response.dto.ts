import { ApiProperty } from '@nestjs/swagger';
import { CurrencyCode } from 'src/types/currency-codes.enum';

class Rate {
  @ApiProperty({ example: '015/A/NBP/2025' })
  no: string;

  @ApiProperty({ example: '2025-01-23' })
  effectiveDate: string;

  @ApiProperty({ example: 4.0515 })
  mid: number;
}

export class ExchangeRateResponseDto {
  @ApiProperty({ example: 'A' })
  table: string;

  @ApiProperty({ example: 'dolar amerykański' })
  currency: string;

  @ApiProperty({ enum: CurrencyCode, example: CurrencyCode.USD })
  code: CurrencyCode;

  @ApiProperty({ type: [Rate] })
  rates: Rate[];
}
