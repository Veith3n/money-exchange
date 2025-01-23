import { Injectable } from '@nestjs/common';
import { ExchangeRateResponseDto } from 'src/nbp-api/dto/exchange-rate-response.dto';
import { NbpApiService } from 'src/nbp-api/nbp-api.sevice';
import { CurrencyCode } from 'src/types/currency-codes.enum';

import { ExchangeRateDto } from './dto/exchange-rate.dto';

@Injectable()
export class ExchangeRateApiService {
  constructor(private readonly nbpApiService: NbpApiService) {}

  public async getExchangeRateForCurrency(
    currencyCode: CurrencyCode,
  ): Promise<ExchangeRateDto> {
    const response =
      await this.nbpApiService.getExchangeRateForCurrency(currencyCode);

    return this.mapExchangeRateResponseToDto(response);
  }

  private mapExchangeRateResponseToDto(
    exchangeRateResponseDto: ExchangeRateResponseDto,
  ): ExchangeRateDto {
    return {
      currencyCode: exchangeRateResponseDto.code,
      exchangeRateToPln: exchangeRateResponseDto.rates[0].mid,
      exchangeRateDate: exchangeRateResponseDto.rates[0].effectiveDate,
    };
  }
}
