import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CurrencyCode } from 'src/types/currency-codes.enum';

import { ExchangeRateDto } from './dto/exchange-rate.dto';
import { ExchangeRateApiService } from './exchange-rate.api.service';

@Controller('api/exchange-rate')
export class ExchangeRateController {
  constructor(
    private readonly exchangeRateApiService: ExchangeRateApiService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Returns exchange rate for currency' })
  @ApiQuery({ name: 'currencyCode', enum: CurrencyCode })
  @ApiOkResponse({ type: ExchangeRateDto })
  async getExchangeRateForCurrency(
    @Query('currencyCode') currencyCode: CurrencyCode,
  ): Promise<ExchangeRateDto> {
    return this.exchangeRateApiService.getExchangeRateForCurrency(currencyCode);
  }
}
