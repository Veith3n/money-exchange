import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { HttpExceptionResponse } from '../dto/http-exception-response';
import { ExchangeRateDto } from './dto/exchange-rate.dto';
import { GetExchangeRateQueryDto } from './dto/get-exchange-rate-query.dto';
import { ExchangeRateApiService } from './exchange-rate.api.service';

@Controller('api/exchange-rate')
export class ExchangeRateController {
  constructor(
    private readonly exchangeRateApiService: ExchangeRateApiService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Returns exchange rate for currency' })
  @ApiOkResponse({ type: ExchangeRateDto })
  @ApiBadRequestResponse({
    description: 'No data found for the given currency code',
    type: HttpExceptionResponse,
  })
  @ApiNotFoundResponse({
    description: 'Failed to fetch exchange rate for currency for given date',
    type: HttpExceptionResponse,
  })
  async getExchangeRateForCurrency(
    @Query() { currencyCode, iso8601Date }: GetExchangeRateQueryDto,
  ): Promise<ExchangeRateDto> {
    return this.exchangeRateApiService.getExchangeRateForCurrency(
      currencyCode,
      iso8601Date,
    );
  }
}
