import { CurrencyCode } from '@/types/currency-codes.enum';

export interface ICurrencyExchangeApiService {
  login(username: string, password: string): Promise<LoginResponse>;

  register(username: string, password: string): Promise<RegisterResponse>;

  getExchangeRateForCurrency(
    currencyCode: CurrencyCode,
  ): Promise<ApiResponse<ExchangeRateResponse>>;

  getWallets(authToken: string): Promise<WalletDto[]>;

  topUpWallet(
    authToken: string,
    currencyCode: CurrencyCode,
    amount: number,
  ): Promise<WalletDto>;

  sellPln(authToken: string, body: ExchangePlnToCurrencyDto): Promise<void>;

  buyPln(authToken: string, body: ExchangeCurrencyToPlnDto): Promise<void>;
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

export interface WalletDto {
  currencyCode: CurrencyCode;
  balance: string;
}

export interface ExchangePlnToCurrencyDto {
  otherCurrencyCode: CurrencyCode;
  amountOfPln: number;
}

export interface ExchangeCurrencyToPlnDto {
  otherCurrencyCode: CurrencyCode;
  amountOfOtherCurrency: number;
}

export type ApiResponse<T> = SuccessApiResponse<T> | FailedApiResponse;
export type SuccessApiResponse<T> = { success: true; data: T };
type FailedApiResponse = { success: false; message: string };
