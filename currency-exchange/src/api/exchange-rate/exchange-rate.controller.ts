import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { JwtUser } from '../../auth/jwt.strategy';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserFromBearer } from '../../decorators/user-from-request';
import { HttpExceptionResponse as HttpExceptionResponseDto } from '../dto/http-exception-response';
import { ExchangePlnToCurrencyDto } from './dto/exchange-pln-to-currency.dto';
import { ExchangeRateDto } from './dto/exchange-rate.dto';
import { GetExchangeRateQueryDto } from './dto/get-exchange-rate-query.dto';
import {
  CurrencyWalletDoesNotExistsError,
  InsufficientFundsError,
} from './errors/errors';
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
    type: HttpExceptionResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Failed to fetch exchange rate for currency for given date',
    type: HttpExceptionResponseDto,
  })
  async getExchangeRateForCurrency(
    @Query() { currencyCode, iso8601Date }: GetExchangeRateQueryDto,
  ): Promise<ExchangeRateDto> {
    return this.exchangeRateApiService.getExchangeRateForCurrency(
      currencyCode,
      iso8601Date,
    );
  }

  @Post('sell-pln')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exchanges PLN to provided currency' })
  @ApiCreatedResponse()
  @ApiNotAcceptableResponse({ type: HttpExceptionResponseDto })
  async exchangePlnToCurrency(
    @Body() body: ExchangePlnToCurrencyDto,
    @UserFromBearer() user: JwtUser,
  ): Promise<void> {
    try {
      await this.exchangeRateApiService.exchangePlnToCurrency({
        ...body,
        userId: user.userId,
      });
    } catch (error) {
      if (error instanceof CurrencyWalletDoesNotExistsError) {
        throw new HttpException(error.message, HttpStatus.NOT_ACCEPTABLE);
      }
      if (error instanceof InsufficientFundsError) {
        throw new HttpException(error.message, HttpStatus.NOT_ACCEPTABLE);
      }

      throw error;
    }
  }
}
