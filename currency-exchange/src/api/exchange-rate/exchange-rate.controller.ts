import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { JwtUser } from '../../auth/jwt.strategy';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserFromBearer } from '../../decorators/user-from-request';
import { HttpExceptionResponse } from '../dto/http-exception-response';
import { ExchangePlnToCurrencyDto } from './dto/exchange-pln-to-currency.dto';
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

  @Post('exchange-pln')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exchanges PLN to provided currency' })
  @ApiCreatedResponse()
  async exchangePlnWithCurrency(
    @Body() body: ExchangePlnToCurrencyDto,
    @UserFromBearer() user: JwtUser,
  ): Promise<void> {
    return this.exchangeRateApiService.exchangePlnToCurrency({
      ...body,
      userId: user.userId,
    });
  }
}
