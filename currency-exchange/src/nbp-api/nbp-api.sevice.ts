import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CurrencyCode } from 'src/types/currency-codes.enum';

import { ExchangeRateResponseDto } from './dto/exchange-rate-response.dto';

@Injectable()
export class NbpApiService {
  private readonly BASE_URL = 'https://api.nbp.pl/api/exchangerates/rates';

  private readonly TABLE_A = 'a';
  private readonly TABLE_B = 'b';
  private readonly TABLE_C = 'c';
  private readonly TABLES = [this.TABLE_A, this.TABLE_B, this.TABLE_C];

  constructor() {}

  public getExchangeRateForCurrency(
    currencyCode: CurrencyCode,
  ): Promise<ExchangeRateResponseDto> {
    const endpointUrl = `${this.BASE_URL}/${this.TABLE_A}/${currencyCode}/`;

    return axios
      .get<ExchangeRateResponseDto>(endpointUrl)
      .then((response) => response.data);
  }
}
