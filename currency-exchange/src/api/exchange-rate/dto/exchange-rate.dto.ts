import { ApiProperty } from '@nestjs/swagger';
import { CurrencyCode } from 'src/types/currency-codes.enum';

export class ExchangeRateDto {
  @ApiProperty({ enum: CurrencyCode })
  currencyCode: CurrencyCode;

  @ApiProperty()
  exchangeRateToPln: number;

  @ApiProperty()
  exchangeRateDate: string;
}
