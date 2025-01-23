import { ApiProperty } from '@nestjs/swagger';
import { CurrencyCode } from 'src/types/currency-codes.enum';

export class WalletDto {
  @ApiProperty()
  currencyCode: CurrencyCode;

  @ApiProperty()
  balance: string;
}
