import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { CurrencyCode } from 'src/types/currency-codes.enum';

export class ExchangeCurrencyToPlnDto {
  @ApiProperty({ enum: CurrencyCode })
  @IsEnum(CurrencyCode)
  otherCurrencyCode: CurrencyCode;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amountOfOtherCurrency: number;
}
