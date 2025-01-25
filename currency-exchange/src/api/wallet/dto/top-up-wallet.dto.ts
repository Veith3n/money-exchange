import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString } from 'class-validator';
import { CurrencyCode } from 'src/types/currency-codes.enum';

export class TopUpWalletDto {
  @ApiProperty()
  @IsEnum(CurrencyCode)
  currencyCode: CurrencyCode;

  @ApiProperty()
  @IsNumberString()
  amount: string;
}
