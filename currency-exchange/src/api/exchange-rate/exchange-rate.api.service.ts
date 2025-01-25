import { Injectable } from '@nestjs/common';
import { ExchangeRateResponseDto } from 'src/nbp-api/dto/exchange-rate-response.dto';
import { NbpApiService } from 'src/nbp-api/nbp-api.sevice';
import { CurrencyCode } from 'src/types/currency-codes.enum';

import { SwapService } from '../../models/entities/swap/swap.service';
import { WalletService } from '../../models/entities/wallet/wallet.service';
import { ExchangeRateDto } from './dto/exchange-rate.dto';
import {
  CurrencyWalletDoesNotExistsError,
  InsufficientFundsError,
} from './errors/errors';

@Injectable()
export class ExchangeRateApiService {
  constructor(
    private readonly nbpApiService: NbpApiService,
    private readonly walletService: WalletService,
    private readonly swapService: SwapService,
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
    return this.exchangeFirstCurrencyToSecondCurrency({
      currencyToBeSold: CurrencyCode.PLN,
      currencyToBought: otherCurrencyCode,
      userId,
      amountOfCurrencyToBeSold: amountOfPln,
    });
  }

  public async exchangeCurrencyToPln({
    userId,
    otherCurrencyCode,
    amountOfOtherCurrency,
  }): Promise<void> {
    return this.exchangeFirstCurrencyToSecondCurrency({
      currencyToBeSold: otherCurrencyCode,
      currencyToBought: CurrencyCode.PLN,
      userId,
      amountOfCurrencyToBeSold: amountOfOtherCurrency,
    });
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

  private async exchangeFirstCurrencyToSecondCurrency({
    currencyToBeSold,
    currencyToBought,
    userId,
    amountOfCurrencyToBeSold,
  }: {
    currencyToBeSold: CurrencyCode;
    currencyToBought: CurrencyCode;
    userId: number;
    amountOfCurrencyToBeSold: number;
  }): Promise<void> {
    if (![currencyToBought, currencyToBeSold].includes(CurrencyCode.PLN)) {
      throw new Error(
        'Unsupported currency exchange, one of the currencies must be PLN',
      );
    }

    const currencyToBeSoldWallet =
      await this.walletService.findForUserAndCurrency(userId, currencyToBeSold);

    if (!currencyToBeSoldWallet) {
      throw new CurrencyWalletDoesNotExistsError(currencyToBeSold);
    }

    if (parseFloat(currencyToBeSoldWallet.balance) < amountOfCurrencyToBeSold) {
      throw new InsufficientFundsError();
    }

    const isPlnBeingSold = currencyToBeSold === CurrencyCode.PLN;
    const nonPlnCurrencyCode = isPlnBeingSold
      ? currencyToBought
      : currencyToBeSold;

    const { exchangeRateToPln } =
      await this.getExchangeRateForCurrency(nonPlnCurrencyCode);

    const amountOfBoughtCurrency = isPlnBeingSold
      ? amountOfCurrencyToBeSold / exchangeRateToPln
      : amountOfCurrencyToBeSold * exchangeRateToPln;

    const currencyToBeBoughtWallet =
      await this.walletService.findOrCreateForUserAndCurrencyCode(
        userId,
        currencyToBought,
      );

    currencyToBeSoldWallet.withdraw(amountOfCurrencyToBeSold);
    currencyToBeBoughtWallet.topUp(amountOfBoughtCurrency);

    await this.walletService.saveAll([
      currencyToBeSoldWallet,
      currencyToBeBoughtWallet,
    ]);

    const exchangeRate = isPlnBeingSold
      ? exchangeRateToPln
      : 1 / exchangeRateToPln;

    await this.swapService.create({
      userId,
      boughtCurrencyCode: currencyToBought,
      boughtCurrencyValue: amountOfBoughtCurrency,
      soldCurrencyCode: currencyToBeSold,
      soldCurrencyValue: amountOfCurrencyToBeSold,
      exchangeRate,
    });
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
