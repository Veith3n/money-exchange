import { CurrencyCode } from '@/types/currency-codes.enum';

export interface ICurrencyExchangeApiService {
  login(username: string, password: string): Promise<LoginResponse>;

  register(username: string, password: string): Promise<RegisterResponse>;

  getExchangeRateForCurrency(
    currencyCode: CurrencyCode,
  ): Promise<ApiResponse<ExchangeRateResponse>>;
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

export type ApiResponse<T> = SuccessApiResponse<T> | FailedApiResponse;
export type SuccessApiResponse<T> = { success: true; data: T };
type FailedApiResponse = { success: false; message: string };
