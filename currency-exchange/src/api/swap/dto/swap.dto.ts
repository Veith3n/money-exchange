import { ApiProperty } from '@nestjs/swagger';
import { CurrencyCode } from 'src/types/currency-codes.enum';

export class SwapDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  boughtCurrencyCode: CurrencyCode;

  @ApiProperty()
  boughtCurrencyValue: number;

  @ApiProperty()
  soldCurrencyCode: CurrencyCode;

  @ApiProperty()
  soldCurrencyValue: number;

  @ApiProperty()
  exchangeRate: number;
}
