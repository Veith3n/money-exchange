import { CurrencyCode } from '@/types/currency-codes.enum';

export interface ICurrencyExchangeApiService {
  login(username: string, password: string): Promise<LoginResponse>;

  register(username: string, password: string): Promise<RegisterResponse>;

  getExchangeRateForCurrency(
    currencyCode: CurrencyCode,
  ): Promise<ExchangeRateResponse>;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterResponse {
  email: string;
}

export interface ExchangeRateResponse {
  currencyCode: CurrencyCode;

  exchangeRateToPln: number;

  exchangeRateDate: string;
}
