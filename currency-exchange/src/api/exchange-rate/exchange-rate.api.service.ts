import { Injectable } from '@nestjs/common';
import { ExchangeRateResponseDto } from 'src/nbp-api/dto/exchange-rate-response.dto';
import { NbpApiService } from 'src/nbp-api/nbp-api.sevice';
import { CurrencyCode } from 'src/types/currency-codes.enum';

import { WalletService } from '../../models/entities/wallet/wallet.service';
import { ExchangeRateDto } from './dto/exchange-rate.dto';

@Injectable()
export class ExchangeRateApiService {
  constructor(
    private readonly nbpApiService: NbpApiService,
    private readonly walletService: WalletService,
  ) {}

  public async exchangePlnToCurrency({
    userId,
    otherCurrencyCode,
    amountOfPln,
  }: {
    userId: number;
    otherCurrencyCode: CurrencyCode;
    amountOfPln: number;
  }): Promise<void> {
    const plnWallet = await this.walletService.findForUserAndCurrency(
      userId,
      CurrencyCode.PLN,
    );

    if (!plnWallet) {
      throw new Error('PLN wallet not found');
    }

    if (parseFloat(plnWallet.balance) < amountOfPln) {
      throw new Error('Insufficient funds');
    }

    const exchangeRate =
      await this.getExchangeRateForCurrency(otherCurrencyCode);

    const amountOfCurrency = amountOfPln / exchangeRate.exchangeRateToPln;

    const otherCurrencyWallet =
      await this.walletService.findOrCreateForUserAndCurrencyCode(
        userId,
        otherCurrencyCode,
      );

    otherCurrencyWallet.topUp(amountOfCurrency);
    plnWallet.withdraw(amountOfPln);

    await this.walletService.saveAll([plnWallet, otherCurrencyWallet]);
  }

  public async getExchangeRateForCurrency(
    currencyCode: CurrencyCode,
    iso8601Date?: string,
  ): Promise<ExchangeRateDto> {
    const response = await this.nbpApiService.getExchangeRateForCurrency(
      currencyCode,
      iso8601Date,
    );

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
